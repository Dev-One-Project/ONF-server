import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { CreateCategoryInput } from './dto/createCategory.input';
import { Category } from './entities/category.entity';

@Resolver()
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [Category], { description: '카테고리 리스트 조회' })
  async fetchCategories(@Args('companyId') companyId: string) {
    return await this.categoryService.findAll({ companyId });
  }

  @Query(() => Category, { description: '카테고리 상세 조회' })
  async fetchCategoryDetail(@Args('categoryId') categoryId: string) {
    return await this.categoryService.getCategoryDetail({ categoryId });
  }

  @Mutation(() => Category, { description: '카테고리 신규 생성' })
  async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return await this.categoryService.create({ createCategoryInput });
  }

  @Mutation(() => Category, { description: '카테고리 정보 수정' })
  async updateCategory(
    @Args('categoryId') categoryId: string,
    @Args('updateCategoryInput') updateCategoryInput: CreateCategoryInput,
  ) {
    return await this.categoryService.update({
      categoryId,
      updateCategoryInput,
    });
  }

  @Mutation(() => Boolean, { description: '카테고리 정보 삭제' })
  async deleteCategory(@Args('categoryId') categoryId: string) {
    return await this.categoryService.delete({ categoryId });
  }
}
