import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'
import  ImageUrlBuilder  from '@sanity/image-url'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, 
  token: process.env.SANITY_API_TOKEN,
})

const builder = ImageUrlBuilder(client);

export function urlFor(src){
  return builder.image(src);
}

