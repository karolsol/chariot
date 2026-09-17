import { vi, type Mocked } from "vitest";
import { Repository } from "typeorm";

export function createMockRepository<T extends object = any>(): Mocked<
  Repository<T>
> {
  return {
    create: vi.fn(),
    save: vi.fn(),
    findOne: vi.fn(),
    find: vi.fn(),
    delete: vi.fn(),
  } as unknown as Mocked<Repository<T>>;
}
