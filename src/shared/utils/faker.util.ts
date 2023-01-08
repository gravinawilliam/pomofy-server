import { faker } from '@faker-js/faker';

import { Email } from '@value-objects/email.value-object';
import { Id } from '@value-objects/id.value-object';
import { Username } from '@value-objects/username.value-object';

import { Password } from '@domain/entities/value-objects/password.value-object';

export const email = (): Email => new Email({ email: faker.internet.email() });

export const id = (): Id => new Id({ id: faker.datatype.uuid() });

export const password = (): Password => new Password({ password: faker.internet.password() });

export const username = (): Username => new Username({ username: faker.internet.userName().toLowerCase() });

export const emailValidationToken = (): string => faker.random.word();
