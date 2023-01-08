import { ISendEmailProvider } from '@contracts/providers/email/send.email-provider';
import { IValidateEmailProvider } from '@contracts/providers/email/validate.email-provider';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';

import { EmailValidatorProvider } from '@infrastructure/providers/email/email-validator.email-provider';
import { TaillowEmailProvider } from '@infrastructure/providers/email/taillow.email-provider';

export const makeValidateEmailProvider = (): IValidateEmailProvider => new EmailValidatorProvider(makeLoggerProvider());

export const makeSendEmailProvider = (): ISendEmailProvider => new TaillowEmailProvider(makeLoggerProvider());
