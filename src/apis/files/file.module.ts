import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { FileService } from './file.service';
import { FileResolver } from './file.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  providers: [FileService, FileResolver],
})
export class FileModule {}
