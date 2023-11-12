if (!require('deldir')) install.packages("deldir");
library(deldir)
coordinates <- matrix(c(
  110, 114, 170, 377, 326, 344, 430, 430, 443, 436, 415, 460, 501,
  256, 257, 259, 399, 249, 181, 179, 186, 191, 197, 189, 218, 238
), ncol = 2, byrow = FALSE)


tesselation <- deldir(coordinates[, 1], coordinates[, 2], rw=c(0, 720, 0, 616))
tiles <- tile.list(tesselation)

plot(tiles, pch = 19,
     border = "white",
     fillcol = hcl.colors(20, "Purple-Yellow"))
