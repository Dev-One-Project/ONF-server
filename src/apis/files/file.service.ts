import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { FileUpload } from 'graphql-upload';
import * as Minio from 'minio';
import { getTodayString } from 'src/common/libraries/utils';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async uploadOne({ data }: { data: FileUpload }) {
    // Setup Minio Client
    const minioClient = new Minio.Client({
      endPoint: process.env.OBJ_STORAGE_ENDPOINT,
      useSSL: true,
      accessKey: process.env.OBJ_STORAGE_ACCESS_KEY_ID,
      secretKey: process.env.OBJ_STORAGE_ACCESS_KEY_SECRET,
    });

    // Upload Image to Minio
    const result: string = await new Promise((res, rej) => {
      const origin_fname = data.filename;
      const fname = `${getTodayString}/origin/${uuid()}-${origin_fname}`;
      minioClient.putObject(
        process.env.OBJ_STORAGE_BUCKET,
        fname,
        data.createReadStream(),
        (err, etag) => {
          if (err) {
            rej(err);
          }
          console.log(new Date(), ' | ========= etag =========', etag);
          res(`${process.env.OBJ_STORAGE_URL_PREFIX}${fname}`);
        },
      );
    });

    const databaseInput: Partial<File> = {
      url: result,
      name: data.filename,
    };
    const file: File = await this.createFile({ file: databaseInput });

    //LOGGING
    console.log(new Date(), ' | ========= image =========', file);
    return file;
  }

  async uploadMany({ data }: { data: FileUpload[] }) {
    const result = await Promise.all(
      data.map((file) => this.uploadOne({ data: file })),
    );
    return result;
  }

  async createFile({ file }: { file: Partial<File> }) {
    const newFile: File = await this.fileRepository.save(file);
    return newFile;
  }
}
