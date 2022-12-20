import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileService } from './file.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { File } from './entities/file.entity';

@Resolver()
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Mutation(() => File, {
    description: 'Upload a single file / Max file size apporximatly 10M',
  })
  async uploadSingleFile(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  ) {
    return await this.fileService.uploadOne({
      data: file,
    });
  }

  @Mutation(() => [File], {
    description: 'Upload multiple files / Max total size approximatly 10M',
  })
  async uploadMultipleFiles(
    @Args('files', { type: () => [GraphQLUpload] }) files: FileUpload[],
  ) {
    return await this.fileService.uploadMany({
      data: files,
    });
  }
}
