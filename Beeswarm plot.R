library(ggplot2)
if (!require('plotly')) install.packages('plotly'); 
library(plotly)

youtubers <- read.csv("youtubers_df.csv")

p <- youtubers %>%
  ggplot( aes(Suscribers, Visits, color = Username)) +
  geom_point() +
  theme_bw() + theme(legend.position = "none")

ggplotly(p)
