import React, { useState, useEffect, useCallback } from 'react';
import { MUSCLE_GROUPS } from '../../data/exercises';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';
import styles from './SocialRoutines.module.scss';
import { BASE_URL } from '../../api/API';

export const SocialRoutines = () => {
  const { user, token } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [expandedPostId, setExpandedPostId] = useState(null);

  // Filtros
  const [search, setSearch] = useState('');
  const [filterMuscle, setFilterMuscle] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // Estado para Crear/Editar
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [postForm, setPostForm] = useState({ title: '', content: '', tags: [] });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (sortBy) params.append('sort', sortBy);
      if (search) params.append('search', search);
      if (filterMuscle) params.append('muscle', filterMuscle);
      params.append('limit', visibleCount);

      const response = await fetch(`${BASE_URL}/social?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      toast.error("Error al conectar con la comunidad");
    } finally {
      setLoading(false);
    }
  }, [token, sortBy, filterMuscle, search, visibleCount]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => fetchPosts(), 500);
    return () => clearTimeout(delayDebounce);
  }, [fetchPosts]);

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`${BASE_URL}/social/${postId}/like`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(prev => prev.map(post => 
          post._id === postId 
          ? { 
              ...post, 
              likesCount: data.likes, 
              likes: data.isLiked ? [...post.likes, user.id] : post.likes.filter(id => id !== user.id) 
            } 
          : post
        ));
      }
    } catch (error) { toast.error("Error en el like"); }
  };

  const handleSavePost = async () => {
    if (!postForm.title || !postForm.content || postForm.tags.length === 0) {
      return toast.error("Completa todos los campos");
    }

    const method = editingPost ? 'PUT' : 'POST';
    const url = editingPost ? `${BASE_URL}/social/${editingPost._id}` : `${BASE_URL}/social`;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          title: postForm.title, 
          content: postForm.content, 
          muscleGroups: postForm.tags // Sincronizado con el estado 'tags'
        })
      });

      if (response.ok) {
        toast.success(editingPost ? "Rutina actualizada" : "¡Rutina compartida! 🚀");
        closeModal();
        fetchPosts();
      } else {
        const errData = await response.json();
        toast.error(errData.errors?.[0]?.message || "Error al procesar");
      }
    } catch (error) { toast.error("Error de conexión"); }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("¿Estás seguro de eliminar esta publicación?")) return;

    try {
      const response = await fetch(`${BASE_URL}/social/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success("Publicación eliminada");
        setPosts(prev => prev.filter(p => p._id !== postId));
      }
    } catch (error) { toast.error("No se pudo eliminar"); }
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setPostForm({ title: post.title, content: post.content, tags: post.muscleGroups });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPost(null);
    setPostForm({ title: '', content: '', tags: [] });
  };

  const toggleTag = (muscle) => {
    setPostForm(prev => ({
      ...prev,
      tags: prev.tags.includes(muscle) ? prev.tags.filter(t => t !== muscle) : [...prev.tags, muscle]
    }));
  };

  const resetFilters = () => {
    setSearch('');
    setFilterMuscle('');
    setSortBy('recent');
  };

  return (
    <div className={styles.socialContainer}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h2>Comunidad <span>EvolutFit</span></h2>
          <p>Explora y comparte rutinas con otros atletas.</p>
        </div>
        <button className={styles.shareBtn} onClick={() => setShowModal(true)}>
          ➕ Compartir mi Rutina
        </button>
      </header>

      {/* Barra de Filtros */}
      <section className={styles.filterBar}>
        <div className={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Buscar rutinas..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
        <div className={styles.selectors}>
          <select value={filterMuscle} onChange={(e) => setFilterMuscle(e.target.value)}>
            <option value="">Todos los músculos</option>
            {MUSCLE_GROUPS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recent">Más recientes</option>
            <option value="popular">Más votadas 🔥</option>
          </select>
        </div>
      </section>

      {/* Grid de Posts o Empty State */}
      <div className={styles.postsGrid}>
        {loading ? (
          <div className={styles.loadingContainer}>Cargando comunidad...</div>
        ) : posts.length > 0 ? (
          posts.map((post) => {
            const isExpanded = expandedPostId === post._id;
            const isOwner = post.author?._id === user?.id || post.userId === user?.id;

            return (
              <article key={post._id} className={`${styles.routineCard} ${isExpanded ? styles.isExpanded : ''}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.userBadge}>
                    {post.author?.name?.[0] || '?'}{post.author?.lastname?.[0] || '?'}
                  </div>
                  <div className={styles.userInfo}>
                    <strong>{post.author?.name} {post.author?.lastname}</strong>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  {isOwner && (
                    <div className={styles.ownerActions}>
                      <button onClick={() => openEditModal(post)} title="Editar">✏️</button>
                      <button onClick={() => handleDelete(post._id)} title="Eliminar">🗑️</button>
                    </div>
                  )}
                  <div className={styles.likesCount}>❤️ {post.likesCount}</div>
                </div>

                <div className={styles.cardBody}>
                  <h4>{post.title}</h4>
                  <div className={`${styles.contentWrapper} ${isExpanded ? styles.showFull : ''}`}>
                    <p>{post.content}</p>
                  </div>
                  <div className={styles.tags}>
                    {post.muscleGroups?.map(tag => <span key={tag} className={styles.tag}>#{tag}</span>)}
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button 
                    className={`${styles.likeBtn} ${post.likes?.includes(user?.id) ? styles.activeLike : ''}`} 
                    onClick={() => handleLike(post._id)}
                  >
                    {post.likes?.includes(user?.id) ? '❤️ Te gusta' : '🤍 Me gusta'}
                  </button>
                  <button className={styles.detailsBtn} onClick={() => setExpandedPostId(isExpanded ? null : post._id)}>
                    {isExpanded ? 'Ver menos' : 'Ver detalle'}
                  </button>
                </div>
              </article>
            );
          })
        ) : (
          /* ESTADO VACÍO (Empty State) */
          <div className={styles.emptyStateContainer}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3>No se encontraron resultados</h3>
            <p>No hay rutinas que coincidan con tu búsqueda o filtros actuales.</p>
            <button onClick={resetFilters} className={styles.resetBtn}>
              Limpiar todos los filtros
            </button>
          </div>
        )}
      </div>

      {/* Modal Unificado */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>{editingPost ? 'Editar' : 'Compartir'} <span>Rutina</span></h3>
            <input 
              className={styles.modalInput} 
              placeholder="Título de la rutina" 
              value={postForm.title} 
              onChange={(e) => setPostForm({...postForm, title: e.target.value})} 
            />
            <textarea 
              className={styles.modalTextarea} 
              placeholder="Describe los ejercicios, series y repeticiones..." 
              value={postForm.content} 
              onChange={(e) => setPostForm({...postForm, content: e.target.value})}
            ></textarea>
            
            <div className={styles.tagSelector}>
              <label>Selecciona los grupos musculares:</label>
              <div className={styles.tagChips}>
                {MUSCLE_GROUPS.map(m => (
                  <button 
                    key={m} 
                    type="button"
                    className={postForm.tags.includes(m) ? styles.tagActive : ''} 
                    onClick={() => toggleTag(m)}
                  >{m}</button>
                ))}
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.publishBtn} onClick={handleSavePost}>
                {editingPost ? 'Guardar Cambios' : 'Publicar Ahora'}
              </button>
              <button className={styles.cancelBtn} onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};