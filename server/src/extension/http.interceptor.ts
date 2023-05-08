import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { IRequest, IResponse } from 'src/utils/interface'

@Injectable()
export class HttpInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpInterceptor.name)
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest() as IRequest
    const response = context.switchToHttp().getResponse() as IResponse

    if (context.getType() === 'http') {
      const className = context.getClass().name
      const methodName = context.getHandler().name
      console.log(request.method + ' ' + request.url)
      console.log('controller: ' + className)
      console.log('handler: ' + methodName)
      console.log('headers: ', request.headers)
      console.log('body: ', request.body)
      console.log('query: ', request.query)
      console.log('params: ', request.params)
      console.log('user: ' + request.user?.username)

      // response.status(400).send('intercepted!')
      response.setHeader('intercepted', 'true')
      // return
    }

    const now = Date.now()
    return next.handle().pipe(
      tap((value) => {
        this.logger.log(
          `${request.method} ${request.url} ${Date.now() - now}ms`,
        )
        // this.logger.debug(value)
      }),
    )
  }
}
