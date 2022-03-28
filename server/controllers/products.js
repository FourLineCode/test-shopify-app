import { gql } from "apollo-boost";
import { createClient } from "../graphql/client";

export async function getAllProducts(shop, accessToken) {
  const client = createClient(shop, accessToken);

  const { data } = await client.query({
    query: gql`
      query GetProducts {
        products(first: 10) {
          edges {
            node {
              id
              title
              createdAt
              priceRange {
                maxVariantPrice {
                  amount
                  currencyCode
                }
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `,
  });

  let products = [];
  if (data && data.products) {
    products = data.products.edges.map(({ node }) => node);
  }

  return products;
}
