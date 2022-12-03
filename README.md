
# Traffic Crashes-2021
## Link to Github Page
https://zofi107.github.io/project-3-crime-analyst-s/
## Link to Observable code used to import project 2 code onto the webpage:
https://observablehq.com/d/c867deaebd8238d6

## Objective
We aim to perform an analysis of the traffic crashes that have taken place in the city of Chicago in 2021. To perform this analysis, we looked at the frequency distributions of various types of crashes and why/when they were caused. Building upon those observations, we identified the reasons for these crashes. We also briefly observed the aggregation of crashes by month.

## Datasets
For this project, we have used the following datasets:
1. Traffic Crashes - Crashes
2. Traffic Crashes - People
3. Traffic_Crashes_Medium

 _Traffic Crashes - Crashes_ contains records of all the crashes that took place in Chicago in 2021.
 
 _Traffic Crashes - People_ is a dataset that had the basic information on the people involved in these crashes such as age, gender, whether they were a passenger or driver, etc.
 
 _Traffic_Crashes_Medium_ is a merged dataset made after cleaning and processing the Crashes and People dataset. We took a random sample of 2500 rows to avoid overplotting.

## Questions regarding the data provided
**Domain Question**
  1. How does weather/season affect traffic crashes?

**Data Questions**
  1. Which age groups are most likely to be in a car crash?
  2. What is the distribution of features like weather conditions during summers vs winters?
  3. What are the frequencies of the types of injuries suffered in summers vs winters?
  4. Do seasons or months affect the total number of crashes?

## Hypotheses
Before beginning our analysis, we came up with the following three hypotheses:

1. People in their prime tend to have more crashes
2. There are more crashes in summer than winter
3. Bad driving conditions lead to more crashes

## Data Preprocessing
The Traffic_Crashes_Medium dataset is the most important one for our analysis. It contains important information about the crashes such as the age, injuries, weather condition, hour, day, month, time, physical condition of the driver, whether there was a road defect or not, etc. The following screen grabs contain the relevant statistics that describe this dataset.

![Columns](./markdown%20pics/columns.png)

## Plotting the Data

## 1. Static Plots
To begin, we plotted the frequency of crashes by month.

![Crashes per month](./markdown%20pics/crashes_per_month.png)

From this, we observed that most crashes occured in June and July(around Summer) and was at it's lowest in Feburary(late Winter/early Spring). We noted that crashes rose from Spring to Summer and then started decreasing from early Fall. From this, we answered out Domain question and our fourth Data question.

## 2. Interactive plots

Next up, to analyze the impact driving conditions have on the number of crashes, we wanted to compare the statistics in good v/s poor driving conditions. Since there is no one column that describes the driving conditions in general, we used the month of the crash as a proxy for driving conditions- summer have good driving conditions, whereas winters have relatively poorer conditions.

In order to effectively compare the statistics for summers and winters, we used an interactive bar chart.

Comparison of weather conditions at time of crash.

![Weather Conditions Summer](./markdown%20pics/wc_summer.png)
![Weather Conditions Winters](./markdown%20pics/wc_winters.png)
![Weather Conditions All Year](./markdown%20pics/wc_ay.png)
![Weather GIF](./markdown%20pics/weather.gif)

Comparison of road conditions at time of crash.

![Road Conditions Summers](./markdown%20pics/rc_summers.png)
![Road Conditions Winters](./markdown%20pics/rc_winters.png)
![Road Conditions All Year](./markdown%20pics/rc_ay.png)
![Road GIF](./markdown%20pics/road.gif)

These plots don't show a definitive increase in car crashes in poor driving conditions- as most of the crashes occured when the weather was clear and the road was dry.

## Linked Views

Finally, we used a linked interactive view plot to examine the damage caused across demographics and at various times of day. To do so, we used a brushable scatterplot(Hour of day v/s Age of driver) and a set of bar plots describing the metrics that measure damage(monetary damage, number of injuries involved, and the most severe injury suffered.)

![Linked View Static](./markdown%20pics/lv_static.png)
![Linked View Selection](./markdown%20pics/lv_selection.png)
![Linked View GIF](./markdown%20pics/linked.gif)

We can see that younger people tend to get in more crashes around midnight, and most of the crashes occur in the evening time.

We also made another multiple linked view visualization using a clickable bar chart (Month/Number of Crashes) and a set of static bar charts that change each time a bar from the interactive bar chart is clicked. These static bar charts describe other metrics that measure the number of crashes made in certain environments(weather, road, and lighting conditions).

[INSERT MULTI LINKED BAR CHART PICS HERE]

From this, we can see that all through the year, most crashes occurred on a road with no defects, during clear skies and in the daylight.

## Revisiting our Hypotheses

Let's take a look at our initial hypotheses and discover how they hold up.

1. People in their prime tend to have more crashes _*Correct!*_
2. There are more crashes in summer than winter _*Correct!*_
3. Bad driving conditions lead to more crashes
_*Incorrect!*_

## Conclusion

In this project, we examined the traffic crashes in Chicago for 2021 and saw how various metrics behave under specific circumstances. It was found that most of the crashes occur in ideal driving conditions- implying negligence on the driver's part. We also used an interactive brushable scatterplot- linked with bar charts- to study the distribution of traffic crashes across demographics throughout the day.

This concludes our project, thank you for reading.
