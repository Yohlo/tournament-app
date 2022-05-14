import Header from '../../components/Header';
import Users from '../../components/Users';

const Admin = () => (
  <>
    <Header xl={3} mx={0}>Admin</Header>
    <p className="text-gray-600 pt-2 text-xs">
      Additional insights into registered users, teams and more coming soon.
    </p>

    <section className="mt-10">
      <h4 className="mt-4 font-bold">Users</h4>
      <Users />
    </section>
  </>
);

export default Admin;
