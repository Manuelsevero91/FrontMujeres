import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

const DataList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        nationality: '',
        bio: '',
        photo: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://647a6c4ad2e5b6101db057d8.mockapi.io/MujeresDestacadas/MujeresDestacadas');
                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al obtener los datos',
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleEdit = (id) => {
        const recordToEdit = data.find(item => item.id === id);
        setFormData(recordToEdit);
        setEditingId(id);
        setIsAdding(false);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Quieres eliminar el registro?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://647a6c4ad2e5b6101db057d8.mockapi.io/MujeresDestacadas/MujeresDestacadas/${id}`, {
                    method: 'DELETE',
                }).then(() => {
                    setData(data.filter(item => item.id !== id));
                    Swal.fire({
                        title: 'Eliminado',
                        text: `El registro ha sido eliminado`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                });
            }
        });
    };

    const handleSave = async () => {
        if (isAdding) {
            try {
                const response = await fetch('https://647a6c4ad2e5b6101db057d8.mockapi.io/MujeresDestacadas/MujeresDestacadas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                const newData = await response.json();
                setData(prevData => [...prevData, newData]);
                setIsAdding(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Creado',
                    text: 'El registro ha sido creado correctamente',
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al guardar los datos',
                });
            }
        } else {
            try {
                await fetch(`https://647a6c4ad2e5b6101db057d8.mockapi.io/MujeresDestacadas/MujeresDestacadas/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                setData(data.map(item => (item.id === editingId ? formData : item)));
                setEditingId(null);
                setIsAdding(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Actualizado',
                    text: 'El registro ha sido actualizado correctamente',
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al guardar los datos',
                });
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAddNew = () => {
        setFormData({
            name: '',
            lastName: '',
            nationality: '',
            bio: '',
            photo: ''
        });
        setEditingId(null);
        setIsAdding(true);
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Cerrar sesión',
            text: '¿Estás seguro de que quieres cerrar sesión?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/'); // Ajusta esta ruta según tu configuración de rutas
                Swal.fire({
                    icon: 'success',
                    title: 'Sesión cerrada',
                    text: 'Has cerrado sesión correctamente.',
                });
            }
        });
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    const filteredData = data.filter(item =>
        item.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    return (
        <div className="tabla-container">
            <header className='barra-superior'>
                <h1>Mujeres Destacadas</h1>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Buscar por nombre"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    <FontAwesomeIcon icon={faSearch} />
                </div>
                <button onClick={handleAddNew}>Agregar</button>
                <button onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Cerrar sesión
                </button>
            </header>
            {isAdding || editingId !== null ? (
                <div className="form-container">
                    <h2>{isAdding ? 'Agregar Nuevo Registro' : 'Editar Registro'}</h2>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nombre"
                    />
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Apellido"
                    />
                    <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        placeholder="Nacionalidad"
                    />
                    <input
                        type="text"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Bio"
                    />
                    <input
                        type="text"
                        name="photo"
                        value={formData.photo}
                        onChange={handleChange}
                        placeholder="Foto"
                    />
                    <button onClick={handleSave}>Guardar</button>
                    <button onClick={() => { setEditingId(null); setIsAdding(false); }}>Cancelar</button>
                </div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Nacionalidad</th>
                            <th className='bio'>Bio</th>
                            <th>Foto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.lastName}</td>
                                <td>{item.nationality}</td>
                                <td>{item.bio}</td>
                                <td>
                                    <img src={item.photo} alt={item.name} style={{ width: '100px', height: 'auto' }} />
                                </td>
                                <td>
                                    <button onClick={() => handleEdit(item.id)}>Editar</button>
                                    <button onClick={() => handleDelete(item.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DataList;


