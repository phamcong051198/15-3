import { HttpException, HttpStatus } from '@nestjs/common';
import {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  SaveOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';
import { Document } from 'mongoose';

import { IRepository } from './base-repository.adapter';
import { CreatedModel, RemovedModel, UpdatedModel } from './type';

export class Repository<T extends Document> implements IRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async isConnected(): Promise<void> {
    if (this.model.db.readyState !== 1) {
      console.log(`db ${this.model.db.name} disconnected`);

      throw new HttpException(
        `db ${this.model.db.name} disconnected`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(
    document: object,
    saveOptions?: SaveOptions,
  ): Promise<CreatedModel> {
    const createdEntity = new this.model(document);
    const savedResult = await createdEntity.save(saveOptions);

    return { id: savedResult.id, created: !!savedResult.id };
  }

  async find(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions,
  ): Promise<T[]> {
    return await this.model.find(filter, projection, options);
  }

  async findById(
    id: string | number,
    projection?: ProjectionType<T>,
    options?: QueryOptions,
  ): Promise<T> {
    return await this.model.findById(id, projection, options);
  }

  async findOne(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions,
  ): Promise<T> {
    return await this.model.findOne(filter, projection, options);
  }

  async findAll(
    projection?: ProjectionType<T>,
    options?: QueryOptions,
  ): Promise<T[]> {
    return await this.model.find({}, projection, options);
  }

  async remove(filter: FilterQuery<T>): Promise<RemovedModel> {
    const { deletedCount } = await this.model.deleteOne(filter);
    return { deletedCount, deleted: !!deletedCount };
  }

  async updateOne(
    filter: FilterQuery<T>,
    updated: UpdateWithAggregationPipeline | UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<UpdatedModel> {
    return await this.model.findOneAndUpdate(filter, updated, options);
  }

  // async updateMany(
  //   filter: FilterQuery<T>,
  //   updated: UpdateWithAggregationPipeline | UpdateQuery<T>,
  //   options?: QueryOptions & UpdateManyOptions,
  // ): Promise<UpdatedModel> {
  //   return await this.model.updateMany(filter, updated, options);
  // }
}
