import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;
  function createOneMovie(title: string, genres: string[], year: number) {
    return service.create({
      title: title,
      genres: genres,
      year: year,
    });
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('should return a movie', () => {
      createOneMovie('maddog', ['test'], 2022);
      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
    });

    it('should throw 404 error', () => {
      const movieIdNotExist = 999;
      try {
        service.getOne(movieIdNotExist);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual(
          `Movie with ID: ${movieIdNotExist} not found.`,
        );
      }
    });
  });

  describe('deleteOne', () => {
    it('deletes a movie', () => {
      createOneMovie('maddog', ['test'], 2022);
      const deforeDelete = service.getAll().length;
      service.deleteOne(1);
      const afterDelete = service.getAll().length;
      expect(afterDelete).toBeLessThan(deforeDelete);
    });

    it('should return a 404', () => {
      const movieIdNotExist = 999;
      try {
        service.deleteOne(movieIdNotExist);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('create', () => {
    it('should create a movie', () => {
      const beforeCreate = service.getAll().length;
      createOneMovie('maddog', ['test'], 2022);
      const afterCreate = service.getAll().length;
      expect(afterCreate).toBeGreaterThan(beforeCreate);
    });
  });

  describe('update', () => {
    it('should update a movie', () => {
      createOneMovie('maddog', ['test'], 2022);
      service.update(1, { title: 'Updated Test' });
      const movie = service.getOne(1);
      expect(movie.title).toEqual('Updated Test');
    });
    it('should throw a NotFoundException', () => {
      const movieIdNotExist = 999;
      try {
        service.update(movieIdNotExist, { title: 'Updated Test' });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
