| name                                          | time   |
| --------------------------------------------- | ------ |
| 25MB video (10 img, async method)             | 0.7s   |
| 25MB video (10 img, native ffmpeg)            | 4.02s  |
| 25MB video (9 img, official binding method)   | 4.8s   |
| ---                                           | ---    |
| 1.4GB video (10 img, async method)            | 10s    |
| 1.4GB video (10 img, native ffmpeg)           | 3m 34s |
| 1.4GB video (10 img, official binding method) | 4m 10s |
| ---                                           | ---    |
| fetch m3u8                                    | 3s     |
| fetch & generate 1 image                      | -s     |
| ---                                           | ---    |

