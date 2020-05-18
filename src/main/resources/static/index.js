
const Button = ReactBootstrap.Button;
const Navbar = ReactBootstrap.Navbar;
const Nav = ReactBootstrap.Nav;
const NavDropdown = ReactBootstrap.NavDropdown;

class AppComponent extends React.Component {
    render() {
        return <div>
            <Header title="Hello"></Header>
            <Button variant="primary">Primary</Button> 
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#link">Link</Nav.Link>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    }
}

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.title = props.title;
    }

    render() {
        return <h1>{this.title}</h1>;
    }
}

ReactDOM.render(<AppComponent />, document.getElementById("app"));
