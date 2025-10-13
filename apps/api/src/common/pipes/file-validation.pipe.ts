// apps/api/src/common/pipes/file-validation.pipe.ts
import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { IUploadedFile } from '@connect-phone/shared-types';

//--------------------------------------------------------------

export interface FileValidationOptions {
  maxSize?: number;
  allowedMimeTypes?: string[];
  required?: boolean;
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly options: FileValidationOptions = {}) {
    this.options = {
      maxSize: options.maxSize || 1 * 1024 * 1024,
      allowedMimeTypes: options.allowedMimeTypes || ['image/'],
      required: options.required !== false,
    };
  }

  transform(file: IUploadedFile, metadata: ArgumentMetadata): IUploadedFile {
    if (!file) {
      if (this.options.required) {
        throw new BadRequestException('No file provided');
      }
      return file;
    }

    if (this.options.maxSize && file.size > this.options.maxSize) {
      throw new BadRequestException(
        `File size must be less than ${this.options.maxSize / (1024 * 1024)}MB`
      );
    }

    if (
      this.options.allowedMimeTypes &&
      this.options.allowedMimeTypes.length > 0
    ) {
      const isAllowed = this.options.allowedMimeTypes.some((type) =>
        file.mimetype.startsWith(type)
      );

      if (!isAllowed) {
        throw new BadRequestException(
          `Only ${this.options.allowedMimeTypes.join(', ')} files are allowed`
        );
      }
    }

    return file;
  }
}
