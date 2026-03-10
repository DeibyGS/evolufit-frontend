import React, { useState, useEffect, useCallback } from 'react';
import { MUSCLE_GROUPS } from '../../data/exercises';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import styles from './SocialRoutines.module.scss';
import { BASE_URL } from '../../api/API';

export const SocialRoutines = () => {
  const { user, token } = useAuthStore();
  const currentUserId = user?._id || user?.id;
  
  // Estados de posts y paginación
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  // Filtros
  const [search, setSearch] = useState('');
  const [filterMuscle, setFilterMuscle] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Modal y Formulario
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [backendErrors, setBackendErrors] = useState({});
  const [postForm, setPostForm] = useState({ title: '', content: '', tags: [] });

  const fetchPosts = useCallback(async (isNextPage = false) => {
    if (isNextPage) setLoadingMore(true);
    else setLoading(true);

    try {
      const currentPage = isNextPage ? page + 1 : 1;
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: '10',
        sort: sortBy,
        muscle: filterMuscle,
        search: search
      });

      const response = await fetch(`${BASE_URL}/social?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();

      if (response.ok) {
        const newPosts = data.posts || [];
        setPosts(prev => isNextPage ? [...prev, ...newPosts] : newPosts);
        setHasNextPage(data.hasNextPage || false);
        setPage(currentPage);
      }
    } catch (error) {
      toast.error("Error al conectar con la comunidad");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [token, sortBy, filterMuscle, search, page]);

  useEffect(() => {
    setPage(1);
    const delay = setTimeout(() => fetchPosts(false), 500);
    return () => clearTimeout(delay);
  }, [search, filterMuscle, sortBy]);

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
              likes: data.isLiked ? [...post.likes, currentUserId] : post.likes.filter(id => id !== currentUserId) 
            } 
          : post
        ));
      }
    } catch (error) { toast.error("Error al procesar apoyo"); }
  };

  const handleSavePost = async () => {
    setBackendErrors({});
    if (!postForm.title || !postForm.content || postForm.tags.length === 0) {
      return toast.info("Completa los campos y selecciona al menos un músculo 🏋️");
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
            muscleGroups: postForm.tags 
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(editingPost ? "Rutina actualizada" : "¡Rutina compartida! 🚀");
        closeModal();
        fetchPosts(false);
      } else if (data.errors) {
        const errorsMap = {};
        data.errors.forEach(err => errorsMap[err.path?.[0] || err.field] = err.message);
        setBackendErrors(errorsMap);
      }
    } catch (error) { toast.error("Error de conexión"); }
  };

  const handleDelete = async (postId) => {
    const result = await Swal.fire({
      title: '¿Eliminar rutina?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FFA500',
      cancelButtonColor: '#222',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      background: '#141414',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${BASE_URL}/social/${postId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          toast.success("Rutina eliminada correctamente");
          setPosts(prev => prev.filter(p => p._id !== postId));
        }
      } catch (error) { toast.error("Error al eliminar"); }
    }
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setPostForm({ title: post.title, content: post.content, tags: post.muscleGroups || [] });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPost(null);
    setBackendErrors({});
    setPostForm({ title: '', content: '', tags: [] });
  };

  const toggleTag = (muscle) => {
    setPostForm(prev => ({
      ...prev,
      tags: prev.tags.includes(muscle) 
        ? prev.tags.filter(t => t !== muscle) 
        : [...prev.tags, muscle]
    }));
  };

  return (
    <div className={styles.socialContainer}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h2>Comunidad <span>EvolutFit</span></h2>
          <p>Explora y comparte rutinas con la comunidad.</p>
        </div>
        <button className={styles.shareBtn} onClick={() => setShowModal(true)}>
          COMPARTIR RUTINA ➕
        </button>
      </header>

      {/* Barra de Filtros Armonizada */}
      <section className={styles.filterBar}>
        <div className={styles.inputGroup}>
          <input 
            type="text" 
            placeholder="Buscar rutinas por título..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
        <div className={styles.selectors}>
          <select 
            className={styles.fullWidthSelect}
            value={filterMuscle} 
            onChange={(e) => setFilterMuscle(e.target.value)}
          >
            <option value="">Todos los músculos</option>
            {MUSCLE_GROUPS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <div className={styles.sortToggle}>
            <button 
              className={sortBy === 'recent' ? styles.activeSort : ''} 
              onClick={() => setSortBy('recent')}
            >Recientes</button>
            <button 
              className={sortBy === 'popular' ? styles.activeSort : ''} 
              onClick={() => setSortBy('popular')}
            >Top 🔥</button>
          </div>
        </div>
      </section>

      {/* Grid de Contenido */}
      <div className={styles.postsGrid}>
        {loading && page === 1 ? (
          <div className={styles.placeholder}>Cargando comunidad...</div>
        ) : (
          posts.map((post) => {
            const isExpanded = expandedId === post._id;
            const isMe = String(currentUserId) === String(post.author?._id || post.userId);
            const hasLiked = post.likes?.some(id => String(id) === String(currentUserId));

            return (
              <article key={post._id} className={`${styles.routineCard} ${isMe ? styles.isMeCard : ''}`}>
                {isMe && <span className={styles.meBadge}>TU RUTINA</span>}
                
                <div className={styles.cardHeader}>
                  <div className={`${styles.userAvatar} ${isMe ? styles.avatarMe : ''}`}>
                    {post.author?.name?.[0]}{post.author?.lastname?.[0]}
                  </div>
                  <div className={styles.userInfo}>
                    <strong>{post.author?.name} {post.author?.lastname}</strong>
                    <span className={styles.dateBadge}>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.likesCount}>❤️ {post.likesCount}</div>
                </div>

                <div className={styles.cardBody}>
                  <h4>{post.title}</h4>
                  <p className={isExpanded ? '' : styles.truncated}>{post.content}</p>
                  <div className={styles.tagCloud}>
                    {post.muscleGroups?.map(t => <span key={t} className={styles.tag}>#{t}</span>)}
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button 
                    className={`${styles.likeBtn} ${hasLiked ? styles.activeLike : ''}`} 
                    onClick={() => handleLike(post._id)}
                  >
                    {hasLiked ? 'APOYADO 🔥' : 'APOYAR'}
                  </button>
                  <button className={styles.detailsBtn} onClick={() => setExpandedId(isExpanded ? null : post._id)}>
                    {isExpanded ? 'VER MENOS' : 'VER RUTINA'}
                  </button>
                  {isMe && (
                    <div className={styles.meActions}>
                      <button onClick={() => openEditModal(post)} title="Editar">✏️</button>
                      <button onClick={() => handleDelete(post._id)} title="Eliminar">🗑️</button>
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>

      {hasNextPage && (
        <button className={styles.loadMoreBtn} onClick={(e) => {e.preventDefault(); fetchPosts(true)}} disabled={loadingMore}>
          {loadingMore ? 'CARGANDO...' : 'VER MÁS RUTINAS'}
        </button>
      )}

      {/* Modal de Publicación Estilo RM */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>{editingPost ? 'EDITAR' : 'NUEVA'} <span>RUTINA</span></h3>
            
            <div className={styles.form}>
              <div className={styles.inputGroup}>
                <label>TÍTULO DE LA RUTINA</label>
                <input 
                  value={postForm.title} 
                  onChange={e => setPostForm({...postForm, title: e.target.value})} 
                  className={backendErrors.title ? styles.inputError : ''}
                  placeholder="Ej: Push Day Explosivo"
                />
                {backendErrors.title && <span className={styles.errorText}>{backendErrors.title}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label>DESCRIPCIÓN Y EJERCICIOS</label>
                <textarea 
                  value={postForm.content} 
                  onChange={e => setPostForm({...postForm, content: e.target.value})} 
                  className={backendErrors.content ? styles.inputError : ''}
                  placeholder="Escribe las series, reps y consejos..."
                />
                {backendErrors.content && <span className={styles.errorText}>{backendErrors.content}</span>}
              </div>

              <div className={styles.tagSelector}>
                <label>GRUPOS MUSCULARES</label>
                <div className={styles.tagChips}>
                  {MUSCLE_GROUPS.map(m => (
                    <button 
                      key={m} 
                      type="button"
                      className={postForm.tags.includes(m) ? styles.tagActive : ''} 
                      onClick={() => toggleTag(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.modalActions}>
                <button className={styles.calcBtn} onClick={handleSavePost}>
                  {editingPost ? 'GUARDAR CAMBIOS' : 'PUBLICAR RUTINA 🔥'}
                </button>
                <button className={styles.cancelBtn} onClick={closeModal}>CANCELAR</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};