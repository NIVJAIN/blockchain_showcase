# Daily progress log

# Week 5/8 (23 July---27 July)

## Monday
1. Found a way to get block data by trawling GitHub issues [here](https://github.com/hyperledger/composer/issues/3838)
2. Found a way to do away with the REST API and use Node.js events instead; considering this
3. Build the groundwork for IoT devices by allowing GET UpdateLocation requests with parameters

## Tuesday (TODO)
1. Look into visualisation of the blockchain using Siyang's d3 visualisation
2. Get my hands on a RasPi, light sensor, servo, Wifi adapter?
3. Start work on the shortest path problem (Johnson's algorithm---Bellman Ford, then Dijkstra's).

## Tuesday
1. I abandoned Siyang's visualisation, because d3 can't do "real" animation due to the
limitations of the DOM, and built in in Canvas instead (Easel.js, Tween.js)
2. Got a light sensor, however, I wasn't able to connect it to the Raspi, and also the Raspi has no Wifi.
3. Did not manage to do shortest path problem (Johnson's algorithm---Bellman-Ford and Dijkstra's);

## Wednesday (TODO)
1. Shortest path problem---make sure to make some headway on this
2. Find a way to get a Raspi and set up HTTP request to the server
3. Polish up the canvas blockchain visualisation and make sure it handles multiple block additions
    - Get more information in the canvas blockchain visualisation: transaction information?
4. Find a way to get a servo to push the track up, or look into model train sets
5. Start looking into ways to get terrain, paints, to gussy up the prototype? Cork board base?

## Wednesday
1. _Still_ no headway on the shortest path problem
2. Couldn't get my hands on a Raspi
3. Canvas blockchain visualisation improved:
    - Handles multiple block additions smoothly
    - Displays transaction information for UpdateLocation and AddAsset transactions
4. Attempted to use Pug/Handlebars templating engines to generate the good detail page; didn't work
    - These templating engines do not allow you to run Javascript code at runtime 
    (I think) --- in any case, not worth exploring further
5. Spoke with friends and was recommended a shop in Sunshine Plaza

## Thursday (TODO)
1. Spend at least two hours on the shortest path problem
2. Check in with Oscar to see if he has a Raspi and the sensors I require;
if not, wait for tomorrow's meeting to ask for it
3. Do a slide deck to showcase what I have been working on these past few weeks

## Thursday and Friday
1. Successfully presented and solved the shortest path problem
2. Scheduled meeting with Phillip on the 6th of August