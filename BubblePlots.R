library(ggplot2)
if (!require('plotly')) install.packages('plotly');
if (!require('dplyr')) install.packages('dplyr');
library(plotly)
library(dplyr)

data <- read.csv("Salary_Data.csv")

data %>%
  arrange(desc(Years.of.Experience)) %>%
  mutate(Education = factor(Age, levels = unique(Age))) %>%
  ggplot(aes(x = Salary, y = Age, size = Years.of.Experience)) +
    geom_point(alpha = 0.5) +
    scale_size(range = c(1, 10), name = "Years of Experience") +
    labs(x = "Salary", y = "Education Level", title = "Bubble Plot")



data_sample <- data %>%
  sample_n(500, replace = FALSE)

p <- data_sample %>%
  arrange(desc(Years.of.Experience)) %>%
  ggplot(aes(x = Salary, y = Age, size = Years.of.Experience, color = Gender)) +
    geom_point(alpha = 0.5) +
    scale_size(range = c(1, 10), name = "Years of Experience") +
    labs(x = "Salary", y = "Age", title = "Bubble Plot") +
    theme_bw() 

ggplotly(p)
