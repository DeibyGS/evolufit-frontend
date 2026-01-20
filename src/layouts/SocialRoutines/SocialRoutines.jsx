import React, { useState, useEffect, useCallback } from 'react';
import { MUSCLE_GROUPS } from '../../data/exercises';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';
import styles from './SocialRoutines.module.scss';

export const SocialRoutines = () => {
  const { user, token } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  
  // Estado para expansión individual
  const [expandedPostId, setExpandedPostId] = useState(null);

  // Filtros
  const [search, setSearch] = useState('');
  const [filterMuscle, setFilterMuscle] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // Estado para crear post
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: [] });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ sort: sortBy, muscle: filterMuscle, search: search }).toString();
      const response = await fetch(`http://localhost:8080/api/social?${query}`, {
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
  }, [token, sortBy, filterMuscle, search]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => fetchPosts(), 500);
    return () => clearTimeout(delayDebounce);
  }, [fetchPosts]);

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/social/${postId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(prev => prev.map(post => 
          post._id === postId 
          ? { ...post, likesCount: data.likes, likes: data.isLiked ? [...post.likes, user.id] : post.likes.filter(id => id !== user.id) } 
          : post
        ));
      }
    } catch (error) { toast.error("Error en el like"); }
  };

  const handlePublish = async () => {
    if (!newPost.title || !newPost.content || newPost.tags.length === 0) {
      return toast.error("Completa todos los campos");
    }
    try {
      const response = await fetch('http://localhost:8080/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: newPost.title, content: newPost.content, muscleGroups: newPost.tags })
      });
      if (response.ok) {
        toast.success("¡Rutina compartida! 🚀");
        setShowModal(false);
        setNewPost({ title: '', content: '', tags: [] });
        fetchPosts();
      }
    } catch (error) { toast.error("Error al publicar"); }
  };

  const toggleTag = (muscle) => {
    setNewPost(prev => ({
      ...prev,
      tags: prev.tags.includes(muscle) ? prev.tags.filter(t => t !== muscle) : [...prev.tags, muscle]
    }));
  };

  const toggleDetails = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
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

      <section className={styles.filterBar}>
        <div className={styles.searchBox}>
          <input type="text" placeholder="Buscar rutinas..." value={search} onChange={(e) => setSearch(e.target.value)} />
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

      <div className={styles.postsGrid}>
        {posts.slice(0, visibleCount).map((post) => {
          const isExpanded = expandedPostId === post._id;
          return (
            <article key={post._id} className={`${styles.routineCard} ${isExpanded ? styles.isExpanded : ''}`}>
              <div className={styles.cardHeader}>
                <div className={styles.userBadge}>{post.author.name[0]}{post.author.lastname[0]}</div>
                <div className={styles.userInfo}>
                  <strong>{post.author.name} {post.author.lastname}</strong>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={styles.likesCount}>❤️ {post.likesCount}</div>
              </div>

              <div className={styles.cardBody}>
                <h4>{post.title}</h4>
                <div className={`${styles.contentWrapper} ${isExpanded ? styles.showFull : ''}`}>
                  <p>{post.content}</p>
                </div>
                <div className={styles.tags}>
                  {post.muscleGroups.map(tag => <span key={tag} className={styles.tag}>#{tag}</span>)}
                </div>
              </div>

              <div className={styles.cardActions}>
                <button 
                  className={`${styles.likeBtn} ${post.likes.includes(user?.id) ? styles.activeLike : ''}`} 
                  onClick={() => handleLike(post._id)}
                >
                  {post.likes.includes(user?.id) ? '❤️ Te gusta' : '🤍 Me gusta'}
                </button>
                <button className={styles.copyBtn} onClick={() => toggleDetails(post._id)}>
                  {isExpanded ? 'Ver menos' : 'Ver detalle'}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Compartir <span>Rutina</span></h3>
            <input className={styles.modalInput} placeholder="Título" value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} />
            <textarea className={styles.modalTextarea} placeholder="Contenido..." value={newPost.content} onChange={(e) => setNewPost({...newPost, content: e.target.value})}></textarea>
            <div className={styles.tagSelector}>
              <div className={styles.tagChips}>
                {MUSCLE_GROUPS.map(m => (
                  <button key={m} className={newPost.tags.includes(m) ? styles.tagActive : ''} onClick={() => toggleTag(m)}>{m}</button>
                ))}
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.publishBtn} onClick={handlePublish}>Publicar Ahora</button>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};