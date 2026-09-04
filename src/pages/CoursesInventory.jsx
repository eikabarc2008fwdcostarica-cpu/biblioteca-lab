import { useState, useEffect } from 'react';
import {
  PlusCircle,
  Plus,
  Trash2,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  PackageOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './CoursesInventory.css';

/**
 * Componente de página CoursesInventory
 * Muestra el catálogo de cursos disponibles y, para administradores,
 * permite la creación y eliminación con iconos profesionales.
 */
const CoursesInventory = () => {
  // Datos del usuario actual autenticado
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  // Estados generales para la lista de cursos
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados del formulario para agregar cursos (solo administradores)
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [materialsAvailable, setMaterialsAvailable] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // 1. Efecto: Cargar cursos al montar el componente
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:3001/courses');

        if (!response.ok) {
          throw new Error(`Error al consultar los cursos (${response.status})`);
        }

        const data = await response.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err instanceof TypeError && err.message.toLowerCase().includes('fetch')
            ? 'No se pudo conectar con el servidor. ¿Está activo JSON Server en http://localhost:3001?'
            : err.message || 'Error al obtener la lista de cursos.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // 2. Administrador: Crear un nuevo curso (POST)
  const handleAddCourse = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim() || !category.trim()) {
      setFormError('Por favor, ingresa el título y la categoría del curso.');
      return;
    }

    const availableCount = Number(materialsAvailable);
    if (isNaN(availableCount) || availableCount < 0) {
      setFormError('La cantidad de materiales debe ser un número mayor o igual a 0.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newCourseData = {
        title: title.trim(),
        category: category.trim(),
        materialsAvailable: availableCount,
      };

      const response = await fetch('http://localhost:3001/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCourseData),
      });

      if (!response.ok) {
        throw new Error('No se pudo guardar el nuevo curso en el servidor.');
      }

      const createdCourse = await response.json();

      // Actualizamos el estado local de forma inmediata
      setCourses((prevCourses) => [...prevCourses, createdCourse]);

      // Limpiamos los campos del formulario
      setTitle('');
      setCategory('');
      setMaterialsAvailable(1);
    } catch (err) {
      setFormError(err.message || 'Fallo al intentar agregar el curso.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Administrador: Eliminar curso (DELETE)
  const handleDeleteCourse = async (courseId, courseTitle) => {
    const isConfirmed = window.confirm(
      `¿Confirmas que deseas eliminar el curso "${courseTitle}"? Esta acción no se puede deshacer.`
    );

    if (!isConfirmed) return;

    try {
      const response = await fetch(`http://localhost:3001/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar el curso del servidor.');
      }

      // Actualizamos el estado local filtrando el curso eliminado
      setCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId));
    } catch (err) {
      alert(`Error al eliminar: ${err.message}`);
    }
  };

  return (
    <div className="courses-container">
      {/* Encabezado */}
      <header className="courses-header">
        <h1>Inventario de Cursos</h1>
        <p>Explora el catálogo de cursos y la disponibilidad de materiales para laboratorio.</p>
      </header>

      {/* RENDERIZADO CONDICIONAL: Formulario solo para Administradores */}
      {isAdmin && (
        <section className="admin-card">
          <h2 className="admin-card-title">
            <PlusCircle size={22} className="admin-icon" />
            <span>Agregar Nuevo Curso (Panel Admin)</span>
          </h2>

          {formError && (
            <div className="alert-box error" role="alert">
              <AlertCircle size={18} className="alert-icon-svg" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleAddCourse} className="admin-form">
            <div className="form-field">
              <label htmlFor="course-title">Título del Curso</label>
              <input
                id="course-title"
                type="text"
                placeholder="Ej. Introducción a Robótica"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="course-category">Categoría</label>
              <input
                id="course-category"
                type="text"
                placeholder="Ej. Electrónica, Software, Ciencias"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="course-materials">Materiales Disponibles</label>
              <input
                id="course-materials"
                type="number"
                min="0"
                value={materialsAvailable}
                onChange={(e) => setMaterialsAvailable(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-add-course"
              disabled={isSubmitting}
            >
              <Plus size={18} />
              <span>{isSubmitting ? 'Guardando...' : 'Crear Curso'}</span>
            </button>
          </form>
        </section>
      )}

      {/* Estado de Error al consultar la API */}
      {error && (
        <div className="alert-box error" role="alert">
          <AlertTriangle size={18} className="alert-icon-svg" />
          <span>{error}</span>
        </div>
      )}

      {/* Estado de Carga */}
      {loading ? (
        <div className="courses-loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando inventario de cursos...</p>
        </div>
      ) : (
        /* Lista de Cursos */
        <>
          {courses.length === 0 && !error ? (
            <div className="alert-box empty">
              <PackageOpen size={42} className="empty-icon" />
              <p>No hay cursos registrados en este momento.</p>
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map((course) => {
                const hasMaterials = Number(course.materialsAvailable) > 0;

                return (
                  <article key={course.id} className="course-card">
                    <div>
                      <div className="course-top">
                        <span className="course-category">{course.category}</span>
                      </div>
                      <h3 className="course-title">{course.title}</h3>
                    </div>

                    <div className="course-status-row">
                      {/* Indicador visual profesional con icono CheckCircle2 / XCircle */}
                      <span
                        className={`status-badge ${
                          hasMaterials ? 'available' : 'unavailable'
                        }`}
                      >
                        {hasMaterials ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <XCircle size={16} />
                        )}
                        <span>
                          {hasMaterials
                            ? `Material disponible (${course.materialsAvailable} ${
                                course.materialsAvailable === 1 ? 'unidad' : 'unidades'
                              })`
                            : 'Sin material disponible (Agotado)'}
                        </span>
                      </span>
                    </div>

                    {/* RENDERIZADO CONDICIONAL: Botón Eliminar solo para Admin */}
                    {isAdmin && (
                      <div className="course-card-actions">
                        <button
                          type="button"
                          className="btn-delete-course"
                          onClick={() => handleDeleteCourse(course.id, course.title)}
                        >
                          <Trash2 size={15} />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CoursesInventory;
