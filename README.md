# WhatsApp Message Transmission & E2EE Protocol Simulator

An interactive, responsive single-page web application built with pure **HTML5, CSS3, and JavaScript** that visualizes the end-to-end lifecycle of a WhatsApp message. Designed specifically for **Computer Networks (CN) college presentations, labs, and viva demonstrations**.

---

## 🌟 Key Features

1. **Sender Panel (Alice)**
   - Type custom messages or select presets.
   - Interactive WhatsApp mobile mockup with message composition and send triggers.
   - Signal Protocol key derivation display (Alice Identity Key `IK_Alice`, Ephemeral Key `EK_Alice`, and Double Ratchet step).

2. **Network & DNS Resolution Panel**
   - **DNS Resolution (UDP 53)**: Animated query of domain `c.whatsapp.net` resolving to WhatsApp gateway IP `157.240.22.53` (A record with TTL).
   - **TCP 3-Way Handshake (RFC 793)**: Step-by-step interactive diagram of `SYN`, `SYN-ACK`, and `ACK` flags establishing transport session.
   - **TLS 1.3 Transport Security**: Secure channel handshake protecting packet payload in transit.

3. **WhatsApp Edge Relay Server**
   - **Zero-Knowledge Architecture**: Demonstrates that the server only inspects routing headers and never has access to Bob's private decryption keys.
   - Active gateway socket registry table (`fd#4102` for Alice, `fd#5190` for Bob).
   - Real-time ciphertext payload inspection frame.

4. **Receiver Panel (Bob)**
   - Real-time push delivery to Bob's WhatsApp screen mockup.
   - Local cryptographic engine: Derives ECDH shared secret, verifies HMAC-SHA256 authentication tag, and decrypts ciphertext.
   - Dynamic typewriter / matrix scramble decryption effect revealing plaintext.

5. **Security & Acknowledgement Lifecycle**
   - **Live Scramble Visualizer**: Shows plaintext transforming into AES-256-GCM ciphertext and back.
   - **The 3 WhatsApp Ticks Lifecycle**:
     - 🕒 **Clock (Pending)**: Enqueued in local SQLite database awaiting socket.
     - ✓ **Single Grey Tick (Sent)**: Reached WhatsApp edge server and stored.
     - ✓✓ **Double Grey Tick (Delivered)**: Reached Bob's hardware over push socket.
     - ✓✓ **Double Blue Tick (Read)**: Bob viewed the chat thread; read receipt dispatched back to Alice.
   - **TLS vs. E2EE Comparison**: Side-by-side architectural comparison.

6. **Interactive Presentation Controls**
   - **▶ Start Full Demo**: Automatically animates the entire end-to-end journey.
   - **⏭ Next Stage**: Advances one stage at a time (perfect for presenting step-by-step to a professor or class).
   - **⏸ Pause / Resume**: Freeze the animation at any critical moment.
   - **🔄 Reset**: Clean reset for replaying.
   - **Speed Selector**: 0.6x (Slow / Detail), 1.0x (Normal), 1.8x (Fast).
   - **Web Audio Sound Effects**: Subtle synthesized send tones, tick sounds, and delivery chimes via Web Audio API.

7. **Live Protocol Terminal & Event Log**
   - Live stream of network packets, protocol layers (`NET`, `CRYPTO`, `SERVER`, `ACK`), timestamps, and hex dumps.
   - Filtering buttons, copy log, and clear log features.

---

## 🚀 How to Run

No installations, Node.js, databases, or backend servers are required!

1. Clone or download this project folder:
   ```bash
   cd CN_proj
   ```
2. Open `index.html` in any modern web browser:
   - On macOS: double-click `index.html` or run:
     ```bash
     open index.html
     ```
   - On Windows: double-click `index.html` or run:
     ```cmd
     start index.html
     ```
   - On Linux:
     ```bash
     xdg-open index.html
     ```

---

## 🎓 College Presentation & Viva Guide

### Frequently Asked Questions in Computer Networks Viva:

1. **Why does WhatsApp use both TLS 1.3 and End-to-End Encryption (E2EE)?**
   - **TLS 1.3** encrypts hop-by-hop between the client and the WhatsApp server to protect metadata, prevent ISP eavesdropping, and secure the connection.
   - **E2EE (Signal Protocol)** encrypts message content between Alice and Bob. The server only sees encrypted ciphertext blobs and cannot read the message even if intercepted or subpoenaed.

2. **How does the TCP 3-Way Handshake work in this demo?**
   - **Step 1 (`SYN`)**: Alice sends a SYN packet with initial sequence number `Seq=1000`.
   - **Step 2 (`SYN-ACK`)**: WhatsApp server responds with `Seq=5000` and acknowledges Alice with `Ack=1001`.
   - **Step 3 (`ACK`)**: Alice sends `Ack=5001` with `Seq=1001`, transitioning both ends to `ESTABLISHED`.

3. **What is the difference between Single Tick, Double Grey Tick, and Blue Tick?**
   - **Single Tick**: Network confirmation that the WhatsApp server has acknowledged receipt (`MessageAck`).
   - **Double Grey Tick**: Bob's phone received the payload over its persistent TCP/Push socket and sent back a `DeliveryReceipt`.
   - **Double Blue Tick**: Bob opened the conversation UI, triggering a `ReadReceiptMessage` event.

---

## 📁 File Structure

- `index.html` — Main HTML5 structure featuring the 5 stages, network topology canvas, dual mock phones, and terminal.
- `style.css` — WhatsApp green-and-white theme, CSS grid, device mockups, and packet flow animations.
- `app.js` — Core state machine, cryptographic scramble simulator, packet animation loops, and audio synthesizer.
- `README.md` — Project documentation and viva guide.

---

*Disclaimer: This is an independent educational simulation created for Computer Science and Computer Networks demonstrations. It does not connect to Meta / WhatsApp production servers.*
# CN-proj
