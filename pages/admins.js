import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";


function AdminsPage({swal}) {
    const [admins,setAdmins] = useState([]);
    const [name,setName] = useState('');
    const [email,setEmail] = useState ('');

    useEffect(() => { fetchAdmins();}, []);

    function fetchAdmins() {
        axios.get('/api/admins').then(response => {
            setAdmins(response.data);
          });
    }

    async function addAdmin(ev){
        ev.preventDefault();
        const data = {name,email};
        await axios.post('/api/admins',data);
        setName('');
        setEmail('');
        fetchAdmins();
    }
    
    function deleteAdmin(admin) {
        swal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete ${admin.name}?`,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Yes, Delete!',
        confirmButtonColor: '#d55',
        reverseButtons: true,
    }).then(async result => {
        if (result.isConfirmed) {
            const {_id} = admin;
            try {
                await axios.delete('/api/admins?_id=' + _id);
                fetchAdmins();
            } catch (error) {
                // Mostrar un mensaje de error al usuario
                alert('Error al intentar borrar el administrador: ' + (error.response?.data?.error || error.message));
            }
        }
    });
    }

    return(
        <Layout>
            <label>Add New Admin</label>
            <div className="flex mt-2">
                <input 
                type="text"
                placeholder="Admin name"
                value={name}
                onChange={ev => setName(ev.target.value)}/>
                <input 
                type="email"
                placeholder="Admin e-mail (gmail)"
                value={email}
                onChange={ev => setEmail(ev.target.value)}/>
            </div>
            <div>
            <button 
            type="button"
            className="btn-primary"
            onClick={addAdmin}>
                Save
            </button>
            </div>
            <h1>Admins</h1>
            <table className="basic mt-2">
                <thead >
                    <tr>
                        <td>Name</td>
                        <td>Email</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {admins.map(admin => (
                        <tr key={admin._id}>
                            <td>{admin.name}</td>
                            <td>{admin.email}</td>
                            <td>
                                <button
                                className="btn-red"
                                type="button"
                                onClick={() => deleteAdmin(admin)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </Layout>
    )
}

export default withSwal(({swal}, ref) => (
    <AdminsPage swal={swal} />
));