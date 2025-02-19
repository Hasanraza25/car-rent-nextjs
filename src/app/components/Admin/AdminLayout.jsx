const   AdminLayout = ({ children }) => {
    return (
      <div className="admin-layout">
        <header>
          <h1>Admin Panel</h1>
          <nav>
            <a href="/admin/dashboard">Dashboard</a>
            <a href="/admin/users">Users</a>
            <a href="/admin/cars">Cars</a>
            <a href="/admin/reviews">Reviews</a>
          </nav>
        </header>
        <main>{children}</main>
        <style jsx>{`
          .admin-layout {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
          header {
            background: #333;
            color: #fff;
            padding: 1rem;
          }
          nav a {
            color: #fff;
            margin-right: 1rem;
            text-decoration: none;
          }
          main {
            flex: 1;
            padding: 1rem;
          }
        `}</style>
      </div>
    );
  };
  
  export default AdminLayout;