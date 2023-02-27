const zmq = require("zeromq")

async function run() {
  const sock = new zmq.Subscriber

  sock.connect("tcp://127.0.0.1:3001")
  sock.subscribe("")
  console.log("Subscriber connected to port 3001")

  for await (const [topic, msg] of sock) {
    // console.log("received a message related to:", topic, "containing message:", msg, msg.toString())
    let data = JSON.parse(msg.toString());
      console.log('topic:', topic.toString(), 'received message:', JSON.stringify(data));
    //console.log("received a message related to:", topic, "containing message:", JSON.parse(msg.toString()));
  }
}

run()
