import httpStatus from 'http-status';

import { AppError } from '../../utils/AppError';
import {
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from './category.interface';
import { prisma } from '../../lib/prisma';

const createCategory = async (payload: ICreateCategoryPayload) => {
  const existing = await prisma.category.findUnique({
    where: { name: payload.name },
  });
  if (existing) {
    throw new AppError(
      'Category with this name already exists',
      httpStatus.CONFLICT,
    );
  }
  return prisma.category.create({ data: payload });
};

const getAllCategories = async () => {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError('Category not found', httpStatus.NOT_FOUND);
  }
  return category;
};

const updateCategory = async (id: string, payload: IUpdateCategoryPayload) => {
  await getCategoryById(id); // throws 404 if missing
  return prisma.category.update({ where: { id }, data: payload });
};

const deleteCategory = async (id: string) => {
  await getCategoryById(id);
  await prisma.category.delete({ where: { id } });
};

export const CategoryServices = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
