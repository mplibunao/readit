

This are things that I could improve on if I were starting the project from scratch

- Move all zod schemas to separate package including all common utils, errors 
	- This is to prevent from needing to build api whenever we build web because web imports from api
- Move db typegen to db package instead of bundling it with migration

