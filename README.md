## Experimenting with the Streams API

The code in this repo is used as an example for an article on my blog at [deanhume.com](https://deanhume.com/experimenting-with-the-streams-api/). 

![Streams API](https://deanhume.com/content/images/2019/03/streams-api.jpg)

The benefit of using streams is that if you are sending large chunks of data over the web, you can start processing the data immediately as you receive it, without having to wait for the full download to complete. For example, if you think of a large video file and imagine how long it might take to download the whole file. Using a stream allows you to download only the small amount of data that you need to view the video instead of the whole file - this means that you can view the video as quickly as the network takes to get you just those bytes.


