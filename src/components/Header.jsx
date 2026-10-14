
const Header = () => {
    return (
        <header className="header">
            <div className="header-inner">
                <span className="brand"><span aria-hidden="true">&#127819;</span> Little Lemon</span>
                <nav aria-label="Main navigation">
                    <a href="#home">Home</a>
                    <a href="#about">About us</a>
                    <a href="#reserve">Reserve a table</a>
                </nav>
            </div>
        </header>

    )
}

export default Header;