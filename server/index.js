const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04c163a3b0d816b0d2633bfec08c2a2d4050dbb07ebe3c438fd57b48f418423d358ad73d33af4c42d67f28de48fbfda17b679915eb88359bb1b854ff4583afd68b": 100,
  "04452c3df25a590608cdc63d4a857b7a4906c599c9a0fa19048fb26c710cd9c7aed5fa6c977bcb1efeb5079adc8e883287cebf8bb14509cd706d4308888d6240c9": 50,
  "04c97ec9791d2f5118bed5788bfe0f851d48e8ae2f4df9ebf3d92f13d48de473d2d6e115287c3cfebc31c2d3d0c9e33bbce02ccf06cb46b71f2a47db30f00c8509": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}