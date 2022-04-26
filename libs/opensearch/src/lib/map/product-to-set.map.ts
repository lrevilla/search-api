import { productSets } from '@peooplev2/models'

import {
  AppDto,
  BeautyDto,
  BookDto,
  ElectronicsDto,
  FashionDto,
  FilmDto,
  FitnessDto,
  GamesDto,
  HomeDto,
  MusicDto,
  PlaceDto,
  ProductDto,
  RestaurantDto,
  TvShowDto,
  VideogameDto
} from '../models'

export const ProductToSetMap = {
  [productSets.apps.alias]: AppDto,
  [productSets.beauty.alias]: BeautyDto,
  [productSets.books.alias]: BookDto,
  [productSets.fashion.alias]: FashionDto,
  [productSets.music.alias]: MusicDto,
  [productSets.places.alias]: PlaceDto,
  [productSets.products.alias]: ProductDto,
  [productSets.restaurants.alias]: RestaurantDto,
  [productSets.series.alias]: TvShowDto,
  [productSets.movies.alias]: FilmDto,
  [productSets.videogames.alias]: VideogameDto,
  [productSets.home.alias]: HomeDto,
  [productSets.electronics.alias]: ElectronicsDto,
  [productSets.fitness.alias]: FitnessDto,
  [productSets.games.alias]: GamesDto
}
