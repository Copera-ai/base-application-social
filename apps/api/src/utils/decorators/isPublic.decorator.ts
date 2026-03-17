import "reflect-metadata";

import { readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const PUBLIC_KEY = Symbol("isPublic");

export function isPublic(): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(PUBLIC_KEY, true, target, propertyKey);
  };
}

export async function getPublicRoutes(): Promise<string[]> {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const directory = resolve(join(currentDir, "..", "..", "service"));
  const controllerInstances = await getAllControllers(directory);
  const publicRoutes: string[] = [];
  for (const instance of controllerInstances) {
    const prototype = Object.getPrototypeOf(instance);
    const methods = Object.getOwnPropertyNames(prototype);

    const controllerRoute = Reflect.getMetadata(
      "fastify-decorator:controller-route",
      prototype.constructor,
    );

    methods.forEach((method) => {
      if (Reflect.getMetadata(PUBLIC_KEY, prototype, method)) {
        const route = Reflect.getMetadata(
          "fastify-decorator:route",
          prototype,
          method,
        );
        if (route) publicRoutes.push(controllerRoute + route);
      }
    });
  }
  return publicRoutes;
}

export async function getAllControllers(directory: string): Promise<any[]> {
  const controllers: any[] = [];

  async function readDirectory(directory: string) {
    const files = readdirSync(directory);

    for (const file of files) {
      const fullPath = join(directory, file);
      if (statSync(fullPath).isDirectory()) {
        await readDirectory(fullPath);
      } else if (file.endsWith(".controller.js")) {
        const controllerModule = await import(fullPath);
        const controllerClass: any = controllerModule.default;
        controllers.push(new controllerClass());
      }
    }
  }

  await readDirectory(directory);

  return controllers;
}
