import { danger, fail, warn } from 'danger';

const paths = {
  folders: {
    controller: {
      development: 'src/application/rest/controllers'
    },
    useCase: {
      development: 'src/domain/use-cases'
    }
  },
  controllers: [
    {
      moduleName: 'tasks',
      fileNames: ['change-task-status', 'create-task', 'list-tasks']
    },
    {
      moduleName: 'users',
      fileNames: ['sign-in', 'sign-up']
    }
  ],
  useCases: [
    {
      moduleName: 'users',
      fileNames: [
        'verify-access-token',
        'sign-up',
        'sign-in',
        'google-sign-in',
        'facebook-sign-in',
        'credentials-sign-in'
      ]
    },
    {
      moduleName: 'tasks',
      fileNames: ['list-tasks', 'create-task', 'change-task-status']
    },
    {
      moduleName: 'notifications',
      fileNames: ['send-email-validation-token']
    }
  ]
};

for (const module of paths.controllers) {
  for (const fileName of module.fileNames) {
    const controllerFile = danger.git.fileMatch(
      `${paths.folders.controller.development}/${module.moduleName}/${fileName}.controller.ts`
    );
    const controllerTestFile = danger.git.fileMatch(
      `${paths.folders.controller.development}/${module.moduleName}/__tests__/${fileName}.controller.spec.ts`
    );

    if (
      (controllerFile.edited || controllerFile.created) &&
      (!controllerTestFile.edited || !controllerTestFile.created)
    ) {
      warn(
        `Existem modificações no arquivo ${fileName}.controller.ts, mas não existem modificações no arquivo ${fileName}.controller.spec.ts de teste. Isto é OK desde que o código esteja sendo refatorado.`
      );
    }
  }
}

for (const module of paths.useCases) {
  for (const fileName of module.fileNames) {
    const useCaseFile = danger.git.fileMatch(
      `${paths.folders.useCase.development}/${module.moduleName}/${fileName}.use-case.ts`
    );
    const useCaseTestFile = danger.git.fileMatch(
      `${paths.folders.useCase.development}/${module.moduleName}/__tests__/${fileName}.use-case.spec.ts`
    );

    const codeUseCase = useCaseFile.edited || useCaseFile.created;
    const codeUseCaseTest = !useCaseTestFile.edited || !useCaseTestFile.created;
    if (codeUseCase && codeUseCaseTest) {
      warn(
        `Existem modificações no arquivo ${fileName}.use-case.ts, mas não existem modificações no arquivo ${fileName}.use-case.spec.ts de teste. Isto é OK desde que o código esteja sendo refatorado.`
      );
    }
  }
}

if (danger.github.pr.body.length <= 10) {
  fail('Por favor descreva melhor a sua PR!');
}

if (danger.github.pr.additions + danger.github.pr.deletions > 400) {
  warn(
    ':exclamation: Wow, essa PR parece grande! _Se ela contém mais de uma modificação, tenta separá-las em PRs menores para facilitar o review_'
  );
}

//* Este objeto pr tem essa propriedade mas o dange não tipou ela
if (danger.github.requested_reviewers.users.length === 0) {
  warn(':exclamation: Não se esqueça de marcar alguém para revisar esta PR!');
}
