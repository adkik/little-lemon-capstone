import './App.css';
import BookingForm from './components/BookingForm';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <a className="skip-link" href="#main">Skip to main content</a>
      <Header />
      <main id="main">
        <section id="home" className="hero" aria-labelledby="home-title">
          <div className="container">
            <div className="hero-text">
              <h1 id="home-title">Little Lemon</h1>
              <p className="subtitle">Chicago</p>
              <p>Fresh Mediterranean food made with family recipes and local ingredients.</p>
              <a className="button" href="#reserve">Reserve a table</a>
            </div>
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80"
              alt="A plate of freshly grilled Mediterranean food"
            />
          </div>
        </section>

        <section id="about" className="about" aria-labelledby="about-title">
          <div className="container">
            <article>
              <h2 id="about-title">About us</h2>
              <p>
                Little Lemon is a family-run restaurant, owned by two brothers. We serve
                classic Mediterranean dishes with a modern twist, in a warm and friendly
                setting. Come hungry and leave happy.
              </p>
            </article>
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80"
              alt="The warmly lit dining room of Little Lemon"
            />
          </div>
        </section>

        <section id="reserve" className="reserve" aria-labelledby="reserve-title">
          <div className="container narrow">
            <h2 id="reserve-title">Reserve a table</h2>
            <BookingForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;

