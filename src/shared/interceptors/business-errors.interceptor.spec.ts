import { BusinessErrorsInterceptor } from './business-errors.interceptor';
import { throwError } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import {
  BusinessError,
  BusinessLogicException,
} from '../errors/business-errors';

let interceptor: BusinessErrorsInterceptor;

describe('BusinessErrorsInterceptor', () => {
  beforeEach(async () => {
    interceptor = new BusinessErrorsInterceptor();
  });

  it(
    'test me',
    marbles((m) => {
      // #region
      const ctx = createMock<ExecutionContext>();

      const next = {
        handle: () => m.cold(''),
      };
      // #endregion

      const handlerData$ = interceptor.intercept(ctx, next);

      /** Marble emiting the error after `TIMEOUT`ms. */
      const expected$ = m.cold(
        '',
        throwError(() => BusinessLogicException('', BusinessError.BAD_REQUEST)),
      );
      m.expect(handlerData$).toBeObservable(expected$);
    }),
  );
});
