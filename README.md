# Blocktrain: Blockchain for supply chain management

Blocktrain (short for Blockchain Train) is a fully-automated model that
showcases the use of *Blockchain for supply chain management*. It doesn't aim
to reinvent the wheel: rather, it aims to showcase how blockchain technology
can be adopted while maintaining existing functionality of asset tracking systems.

## Why blockchain?

The key features of blockchain are its *decentralisation* and *immutability*,
which allow for a *single source of truth*. Currently, companies involved in
the supply chain keep their own siloed data. This makes collaboration
difficult. Suppose I undertake to transport a shipment of goods for you. We
both keep our own ledger of the status of the shipment. What happens if
something happens to the shipment --- damaged in transit, or delivered to
Singapore instead of Shanghai --- and our ledgers don't agree with each
other?

That's why we need a "shared ledger that's updated and validated in real time
with each network participant. The result is an equal visibility of
activities revealing where assets are at any point in time, who owns them and
what condition they're in." [IBM, "Blockchain for Supply
Chain"](https://www.ibm.com/blockchain/industries/supply-chain) And the best
way to do this is to use a blockchain, which guarantees a shared, single
source of truth. A single source of truth means reduced frictions and
increased trust --- a huge ROI for all players! IBM's TradeLens network
already features 90 organisations including Maersk and Walmart sharing more
than a million transactions per day.

## My implementation

This project is a fully-automated train diorama that showcases the key
features of a blockchain-enabled supply chain.

... video here ... 

A train transports shipping containers (goods), each with a different
provenance and description. Each good's information is stored on the
blockchain, and can be accessed by scanning the QR code on the shipping
container.

When the train reaches a station (changes location), each shipping container
updates its location. These updates are, again, stored in the blockchain.

The blockchain is powered by Hyperledger Composer/Hyperledger Fabric.

The train is controlled by means of a relay and reed switch connected to a
Raspberry Pi. I attached a magnet to the train such that ...

I wrote a Python script to poll the GPIO pins of the Pi. When the reed switch
detects a magnetic force, it will cut the relay and it'll also send some HTTP
requests to a Node.js server that I wrote. That Node.js server will in turn
send requests to the blockchain and update it.

I wrote a Node.js server that handles the HTTP requests made by the Raspberry Pi.

## Acknowledgements

Jain
Cason
Jo
Siyang
Anthony