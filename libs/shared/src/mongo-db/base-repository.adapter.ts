import {
  FilterQuery,
  ProjectionType,
  QueryOptions,
  SaveOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';

import { CreatedModel, RemovedModel, UpdatedModel } from './type';

export abstract class IRepository<T> {
  abstract isConnected(): Promise<void>;

  abstract create<T = SaveOptions>(
    document: object,
    saveOptions?: T,
  ): Promise<CreatedModel>;

  abstract findById<
    TProjection = ProjectionType<T>,
    TOptions = QueryOptions<T>,
  >(
    id: string | number,
    projection?: TProjection | null,
    options?: TOptions | null,
  ): Promise<T>;

  abstract findAll<TProjection = ProjectionType<T>, TOptions = QueryOptions<T>>(
    projection?: TProjection | null,
    options?: TOptions | null,
  ): Promise<T[]>;

  abstract find<
    TQuery = FilterQuery<T>,
    TProjection = ProjectionType<T>,
    TOptions = QueryOptions<T>,
  >(
    filter: TQuery,
    projection?: TProjection | null,
    options?: TOptions | null,
  ): Promise<T[]>;

  abstract remove<TQuery = FilterQuery<T>>(
    filter: TQuery,
  ): Promise<RemovedModel>;

  abstract findOne<
    TQuery = FilterQuery<T>,
    TProjection = ProjectionType<T>,
    TOptions = QueryOptions<T>,
  >(
    filter: TQuery,
    projection?: TProjection | null,
    options?: TOptions,
  ): Promise<T>;

  abstract updateOne<
    TQuery = FilterQuery<T>,
    TUpdate = UpdateQuery<T> | UpdateWithAggregationPipeline,
    TOptions = QueryOptions<T>,
  >(
    filter: TQuery,
    updated: TUpdate,
    options?: TOptions,
  ): Promise<UpdatedModel>;

  // abstract updateMany<
  //   TQuery = FilterQuery<T>,
  //   TUpdate = UpdateQuery<T> | UpdateWithAggregationPipeline,
  //   TOptions = QueryOptions<T>,
  // >(
  //   filter: TQuery,
  //   updated: TUpdate,
  //   options?: TOptions,
  // ): Promise<UpdatedModel>;
}
