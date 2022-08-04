# Flower Shop

## Requirements to run the program

- Node.js installed (preferably version >= 16.4) 
- npm installed (preferably version >= 8.7) 

## Install

hit `npm install`

## Execute program

hit `npm run start` to run the program

## Notes about the tests

tests are located at `./tests.txt`

each line represents a item requested. The program does not contains any validation of formatting.
10 R12
15 L09
13 T58


## Notes about the code 

Probably there is a lot of code and configuration for a the problem proposed. But why not to be neat and build something nice :) 

- It is coded on Typescript/Javascript. Maybe its a bit overtyped, but I wanted to reinforce the idea of type checking and documentation.
- Source code its on `/src` folder. 
  -  `types.ts` contains shared types used
  -  `items.ts` represents the flower shop bundle/items/product options. I extracted into another file to make it easily able to fetch this data could come from an API call or DB
  -  `orderBundeler.ts` contains the logic to determine the cost and bundle breakdown for each product. It is a critic logic and deservede to be extracted from the main program flow. (Better for testing as well)
  - `bundleResultGroup.ts` has its own module since it has its own logic.
  - `main.ts` is where the structure of the program is defined. Here you can edit the TestOrders.

## Other files

Other files are just configurations to make linter and typescript works, package bundling. I'm used to work on VSCODE. If the linters/precompilers are well configured you can take advantage of catching errors and use autocomplete features.


# Problem Instructions

### __Context:__

A flower shop used to base the price of their flowers on an item by item cost. So if a
customer ordered 10 roses then they would be charged 10x the cost of single rose. The
flower shop has decided to start selling their flowers in bundles and charging the customer
on a per bundle basis. So if the shop sold roses in bundles of 5 and 10 and a customer
ordered 15 they would get a bundle of 10 and a bundle of 5.
The flower shop currently sells the following products:

__Name | Code | Bundles__

Roses | R12 | [[5, $6.99],[10, $12.99]]

Lilies | L09  | [[3, $9.95],[6, $16.95],[9, $24.95]]

Tulips | T58 | [[3, $5.95],[5, $9.95],[9, $16.99]]

### __Task:__
Given a customer order you are required to determine the cost and bundle breakdown for
each product. To save on shipping space each order should contain the minimal number
of bundles.

#### _Input:_
Each order has a series of lines with each line containing the number of items followed by
the product code
An example input:

* 10 R12
* 15 L09
* 13 T58

#### _Output:_
  
A successfully passing test(s) that demonstrates the following output: (The format of the output is not important)

* 10 R12. total price: $12.99  => 1 x 10_bundle ($12.99)

* 15 L09. total_price: $41.90 => 1 x 9_bundle ($24.95), 1 x 6_bundle($16.95)

* 13 T58. total_price: $25.85 => 2units x 5_bundle ($9.95), 1 x 3_bundle ($5.95)
