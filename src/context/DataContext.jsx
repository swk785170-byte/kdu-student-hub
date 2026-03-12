import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [subjects, setSubjects] = useState([]);
  const [files, setFiles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch subjects
        const { data: subjectsData, error: subjectsError } = await supabase
          .from('subjects')
          .select('*')
          .order('name');
        if (subjectsError) throw subjectsError;
        setSubjects(subjectsData || []);

        // Fetch posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });
        if (postsError) throw postsError;
        setPosts(postsData || []);

        // Fetch files
        const { data: filesData, error: filesError } = await supabase
          .from('files')
          .select('*')
          .order('created_at', { ascending: false });
        if (filesError) throw filesError;

        // Enhance filesData with public URLs from storage
        const enhancedFiles = (filesData || []).map(file => {
          const { data } = supabase.storage
            .from('notes')
            .getPublicUrl(file.storage_path);
            
          return {
            ...file,
            subjectId: file.subject_id, // Map for UI compatibility
            uploader: file.uploader_name, // Map for UI compatibility
            fileUrl: data.publicUrl
          };
        });

        setFiles(enhancedFiles);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addFile = async (fileObj, subjectId, uploaderName) => {
    if (!user) throw new Error("Must be logged in");

    // 1. Upload file to Supabase Storage
    const fileExt = fileObj.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('notes')
      .upload(filePath, fileObj);

    if (uploadError) throw uploadError;

    // 2. Insert metadata into Supabase Database
    const { data: fileData, error: dbError } = await supabase
      .from('files')
      .insert([
        {
          name: fileObj.name,
          type: fileObj.type || 'unknown',
          size: fileObj.size,
          subject_id: subjectId,
          uploader_id: user.id,
          uploader_name: uploaderName,
          storage_path: filePath
        }
      ])
      .select()
      .single();

    if (dbError) throw dbError;

    // 3. Get Public URL for the newly inserted file
    const { data: urlData } = supabase.storage
      .from('notes')
      .getPublicUrl(filePath);

    // 4. Update local state
    const newFileForState = {
      ...fileData,
      subjectId: fileData.subject_id,
      uploader: fileData.uploader_name,
      fileUrl: urlData.publicUrl
    };

    setFiles(prev => [newFileForState, ...prev]);
    return newFileForState;
  };

  const deleteFile = async (fileId) => {
    const fileToDelete = files.find(f => f.id === fileId);
    if (!fileToDelete) return;

    // 1. Delete from storage
    const { error: storageError } = await supabase.storage
      .from('notes')
      .remove([fileToDelete.storage_path]);
      
    if (storageError) console.error("Error deleting from storage", storageError);

    // 2. Delete metadata from DB
    const { error: dbError } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId);

    if (dbError) {
      console.error("Error deleting file metadata", dbError);
    } else {
      setFiles(prev => prev.filter(f => f.id !== fileId));
    }
  };

  const addSubject = async (name, icon) => {
    const { data, error } = await supabase
      .from('subjects')
      .insert([{ name, icon }])
      .select()
      .single();

    if (error) {
      console.error("Error adding subject", error);
      return;
    }

    setSubjects(prev => [...prev, data].sort((a,b) => a.name.localeCompare(b.name)));
  };

  const addPost = async (title, content, authorName) => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('posts')
      .insert([{ 
        title, 
        content, 
        author_id: user.id,
        author_name: authorName 
      }])
      .select()
      .single();

    if (error) {
      console.error("Error adding post", error);
      return;
    }
    
    setPosts(prev => [data, ...prev]);
  };

  const value = {
    subjects,
    files,
    posts,
    addFile,
    deleteFile,
    addSubject,
    addPost,
    loading
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

