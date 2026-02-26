/**
 * Type declarations for Prisma CLI config.
 * The "prisma/config" module is provided by the Prisma CLI at runtime.
 */
declare module 'prisma/config' {
  export function env(name: string): string;
  export function defineConfig<C extends import('prisma').PrismaConfig>(config: C): C;
}
