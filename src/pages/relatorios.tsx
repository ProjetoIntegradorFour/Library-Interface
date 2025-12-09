import { useState, useEffect } from "react";
import "../styles/global.css";

// Defina a interface para os dados do livro
interface BookFormData {
  id?: string;
  isbn: string;
  title: string;
  title_pt: string;
  authors: string;
  publisher: string;
  published_date: string;
  language: string;
  cover_url: string;
  description: string;
  is_admin_overridden: boolean;
  last_synced_at: string;
  created_at: string;
  updated_at: string;
}

// Interface para resposta de erro do backend
interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ApiErrorResponse {
  message: string;
  errors?: ValidationError[];
  code?: string;
}

export default function Cadastro() {
  // Estado para o formulário
  const [formData, setFormData] = useState<BookFormData>({
    isbn: "",
    title: "",
    title_pt: "",
    authors: "",
    publisher: "",
    published_date: "",
    language: "pt",
    cover_url: "",
    description: "",
    is_admin_overridden: false,
    last_synced_at: new Date().toISOString().slice(0, 16),
    created_at: new Date().toISOString().slice(0, 16),
    updated_at: new Date().toISOString().slice(0, 16)
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error' | 'warning' | 'info'}>();
  const [isEditing, setIsEditing] = useState(false);
  const [bookId, setBookId] = useState<string>("");

  // Configuração da URL do backend - CORREÇÃO AQUI
  // Usando variável direta ou import.meta.env para Vite
  const API_BASE_URL = import.meta.env?.VITE_API_URL || 
                       (window as any)?.env?.API_URL || 
                       "http://localhost:8080";
  const CATALOG_API_URL = `${API_BASE_URL}/api/catalog`;

  // Função para limpar ISBN (remover caracteres não numéricos)
  const cleanIsbn = (isbn: string): string => {
    return isbn.replace(/[^0-9]/g, '');
  };

  // Função para buscar dados do livro por ISBN usando SEU backend
  const fetchBookByISBN = async (isbn: string) => {
    const clean = cleanIsbn(isbn);
    if (!clean || (clean.length !== 10 && clean.length !== 13)) {
      setMessage({text: "ISBN deve ter 10 ou 13 dígitos numéricos", type: 'warning'});
      return;
    }

    setLoading(true);
    setMessage({text: "Buscando informações do livro...", type: 'info'});
    console.log(`🔍 Buscando livro com ISBN: ${clean}`);

    try {
      // Primeiro, verifica se já existe no banco
      // Usando endpoint mais comum para busca por ISBN
      const checkResponse = await fetch(`${CATALOG_API_URL}?isbn=${clean}`);
      
      if (checkResponse.ok) {
        const existingBooks = await checkResponse.json();
        if (existingBooks && existingBooks.length > 0) {
          const existingBook = existingBooks[0];
          console.log('📚 Livro já cadastrado:', existingBook);
          setMessage({text: "Este livro já está cadastrado. Você está no modo de edição.", type: 'warning'});
          setIsEditing(true);
          setBookId(existingBook.id);
          
          // Preencher formulário com dados existentes
          const adjustDateForInput = (dateString: string) => {
            if (!dateString) return new Date().toISOString().slice(0, 16);
            return new Date(dateString).toISOString().slice(0, 16);
          };
          
          setFormData({
            isbn: existingBook.isbn || clean,
            title: existingBook.title || "",
            title_pt: existingBook.title_pt || "",
            authors: existingBook.authors || "",
            publisher: existingBook.publisher || "",
            published_date: existingBook.published_date || "",
            language: existingBook.language || "pt",
            cover_url: existingBook.cover_url || "",
            description: existingBook.description || "",
            is_admin_overridden: existingBook.is_admin_overridden || false,
            last_synced_at: adjustDateForInput(existingBook.last_synced_at),
            created_at: adjustDateForInput(existingBook.created_at),
            updated_at: adjustDateForInput(existingBook.updated_at)
          });
          return;
        }
      }

      // Se não existe, busca da API do seu backend
      setMessage({text: "Buscando dados da API externa...", type: 'info'});
      
      const response = await fetch(`${CATALOG_API_URL}/fetch?isbn=${clean}`, {
        method: 'POST'
      });

      console.log('📥 Status da resposta:', response.status);
      
      if (response.ok) {
        const bookData = await response.json();
        console.log('📖 Dados recebidos do backend:', bookData);
        
        // Ajustar datas para o input
        const adjustDateForInput = (dateString: string) => {
          if (!dateString) return new Date().toISOString().slice(0, 16);
          return new Date(dateString).toISOString().slice(0, 16);
        };
        
        setFormData(prev => ({
          ...prev,
          isbn: bookData.isbn || clean,
          title: bookData.title || "",
          title_pt: bookData.title_pt || bookData.title || "",
          authors: bookData.authors || "",
          publisher: bookData.publisher || "",
          published_date: bookData.published_date || "",
          language: bookData.language || "pt",
          cover_url: bookData.cover_url || "",
          description: bookData.description || "",
          last_synced_at: adjustDateForInput(bookData.last_synced_at),
          created_at: adjustDateForInput(bookData.created_at),
          updated_at: adjustDateForInput(bookData.updated_at)
        }));
        
        setMessage({text: "✅ Livro encontrado! Complete os campos restantes.", type: 'success'});
      } else {
        const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
        console.warn('⚠️ Erro do backend:', errorData);
        
        let errorMessage = "ISBN não encontrado nas APIs externas.";
        if (errorData.code === 'ISBN_DUPLICATE') {
          errorMessage = "Este ISBN já está cadastrado no sistema.";
        } else if (errorData.code === 'ISBN_INVALID') {
          errorMessage = "ISBN inválido. Deve ter 10 ou 13 dígitos.";
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
        
        setMessage({text: errorMessage, type: 'warning'});
      }
    } catch (error) {
      console.error("❌ Erro ao buscar livro:", error);
      setMessage({text: "Erro na conexão com o servidor.", type: 'error'});
    } finally {
      setLoading(false);
    }
  };

  // Monitora mudanças no campo ISBN
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const clean = cleanIsbn(formData.isbn);
      if (clean.length === 10 || clean.length === 13) {
        fetchBookByISBN(clean);
      }
    }, 1500);

    return () => clearTimeout(delayDebounce);
  }, [formData.isbn]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      updated_at: new Date().toISOString().slice(0, 16)
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(undefined);

    try {
      // Validar ISBN antes de enviar
      const cleanIsbnValue = cleanIsbn(formData.isbn);
      if (cleanIsbnValue.length !== 10 && cleanIsbnValue.length !== 13) {
        setMessage({text: "ISBN deve ter 10 ou 13 dígitos numéricos", type: 'error'});
        setLoading(false);
        return;
      }

      // Validar campos obrigatórios
      if (!formData.title.trim()) {
        setMessage({text: "Título é obrigatório", type: 'error'});
        setLoading(false);
        return;
      }

      if (!formData.authors.trim()) {
        setMessage({text: "Autores são obrigatórios", type: 'error'});
        setLoading(false);
        return;
      }

      // Preparar dados para envio
      const dataToSend = {
        ...formData,
        isbn: cleanIsbnValue,
        title: formData.title.trim(),
        authors: formData.authors.trim(),
        // Remover ID se for cadastro novo (deixar o backend gerar)
        ...(isEditing && bookId ? { id: bookId } : {}),
        // Converter datas para ISO string
        last_synced_at: new Date(formData.last_synced_at).toISOString(),
        created_at: new Date(formData.created_at).toISOString(),
        updated_at: new Date(formData.updated_at).toISOString(),
        // Garantir que published_date está no formato correto
        published_date: formData.published_date || null
      };

      console.log('📤 Enviando dados para o backend:', dataToSend);
      console.log('🌐 URL da API:', CATALOG_API_URL);

      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `${CATALOG_API_URL}/${bookId}` : CATALOG_API_URL;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      console.log('📥 Status da resposta:', response.status);
      
      let responseData;
      try {
        responseData = await response.json();
        console.log('📦 Resposta do backend:', responseData);
      } catch (jsonError) {
        console.warn('Não foi possível parsear JSON da resposta');
        responseData = { message: await response.text() };
      }

      if (response.ok) {
        const successMessage = isEditing 
          ? `✅ Livro "${formData.title}" atualizado com sucesso!` 
          : `✅ Livro "${formData.title}" cadastrado com sucesso!`;
        
        setMessage({text: successMessage, type: 'success'});
        
        // Se for cadastro novo, armazenar o ID retornado
        if (!isEditing && responseData.id) {
          setBookId(responseData.id);
          setIsEditing(true);
        }
        
        // Resetar formulário após sucesso (apenas se não for edição)
        if (!isEditing) {
          setTimeout(() => {
            resetForm();
          }, 3000);
        }
      } else {
        // Tratar erros de validação do backend
        const errorData: ApiErrorResponse = responseData;
        let errorMessage = "Erro ao processar a solicitação.";
        
        if (errorData.errors && errorData.errors.length > 0) {
          // Mostrar primeiro erro de validação
          errorMessage = errorData.errors[0].message;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (response.status === 404) {
          errorMessage = "Endpoint não encontrado. Verifique a URL da API.";
        } else if (response.status === 500) {
          errorMessage = "Erro interno do servidor.";
        }
        
        setMessage({text: `❌ ${errorMessage}`, type: 'error'});
        console.error('❌ Erro detalhado:', errorData);
      }
    } catch (error: any) {
      console.error('❌ Erro de rede:', error);
      setMessage({text: `❌ Erro de conexão: ${error.message}`, type: 'error'});
    } finally {
      setLoading(false);
    }
  };

  // Função para resetar o formulário
  const resetForm = () => {
    setFormData({
      isbn: "",
      title: "",
      title_pt: "",
      authors: "",
      publisher: "",
      published_date: "",
      language: "pt",
      cover_url: "",
      description: "",
      is_admin_overridden: false,
      last_synced_at: new Date().toISOString().slice(0, 16),
      created_at: new Date().toISOString().slice(0, 16),
      updated_at: new Date().toISOString().slice(0, 16)
    });
    setBookId("");
    setIsEditing(false);
    setMessage(undefined);
  };

  // Função para buscar livro por ID (para edição)
  const fetchBookById = async (id: string) => {
    if (!id) return;
    
    setLoading(true);
    setMessage({text: "Buscando livro...", type: 'info'});
    
    try {
      const response = await fetch(`${CATALOG_API_URL}/${id}`);
      
      if (response.ok) {
        const book = await response.json();
        console.log('📚 Livro encontrado:', book);
        
        // Ajustar formatos de data para o input datetime-local
        const adjustDateForInput = (dateString: string) => {
          if (!dateString) return new Date().toISOString().slice(0, 16);
          const date = new Date(dateString);
          return date.toISOString().slice(0, 16);
        };
        
        setFormData({
          isbn: book.isbn || "",
          title: book.title || "",
          title_pt: book.title_pt || "",
          authors: book.authors || "",
          publisher: book.publisher || "",
          published_date: book.published_date ? book.published_date.slice(0, 10) : "",
          language: book.language || "pt",
          cover_url: book.cover_url || "",
          description: book.description || "",
          is_admin_overridden: book.is_admin_overridden || false,
          last_synced_at: adjustDateForInput(book.last_synced_at),
          created_at: adjustDateForInput(book.created_at),
          updated_at: adjustDateForInput(book.updated_at)
        });
        
        setBookId(book.id);
        setIsEditing(true);
        setMessage({text: "📝 Modo edição: Você está editando um livro existente.", type: 'info'});
      } else {
        setMessage({text: "❌ Livro não encontrado.", type: 'error'});
      }
    } catch (error) {
      console.error("Erro ao buscar livro:", error);
      setMessage({text: "❌ Erro ao carregar livro.", type: 'error'});
    } finally {
      setLoading(false);
    }
  };

  // Função para formatar a exibição do ISBN
  const formatIsbnDisplay = (isbn: string): string => {
    const clean = cleanIsbn(isbn);
    if (clean.length === 13) {
      return clean.replace(/(\d{3})(\d{1})(\d{4})(\d{4})(\d{1})/, '$1-$2-$3-$4-$5');
    } else if (clean.length === 10) {
      return clean.replace(/(\d{1})(\d{4})(\d{4})(\d{1})/, '$1-$2-$3-$4');
    }
    return isbn;
  };

  return (
    <div className="report-page" style={{ 
      padding: "20px", 
      backgroundColor: "#f0f8ff", 
      marginTop: "20px", 
      maxWidth: "900px", 
      margin: "30px auto",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
    }}>
      <h1 style={{ 
        color: "#333", 
        marginBottom: "30px", 
        borderBottom: "2px solid #007bff", 
        paddingBottom: "10px",
        textAlign: "center"
      }}>
        📚 {isEditing ? "Editar Livro" : "Cadastrar Novo Livro"}
      </h1>
      
      {message && (
        <div style={{
          padding: "15px",
          marginBottom: "25px",
          backgroundColor: 
            message.type === 'success' ? "#d4edda" : 
            message.type === 'error' ? "#f8d7da" :
            message.type === 'warning' ? "#fff3cd" : "#d1ecf1",
          color: 
            message.type === 'success' ? "#155724" : 
            message.type === 'error' ? "#721c24" :
            message.type === 'warning' ? "#856404" : "#0c5460",
          borderRadius: "8px",
          border: `1px solid ${
            message.type === 'success' ? "#c3e6cb" : 
            message.type === 'error' ? "#f5c6cb" :
            message.type === 'warning' ? "#ffeaa7" : "#bee5eb"
          }`
        }}>
          <strong>
            {message.type === 'success' ? "✅ " : 
             message.type === 'error' ? "❌ " :
             message.type === 'warning' ? "⚠️ " : "ℹ️ "}
          </strong>
          {message.text}
          {isEditing && bookId && (
            <div style={{ marginTop: "10px", fontSize: "0.9em" }}>
              ID do livro: <code style={{ 
                backgroundColor: "#f1f1f1", 
                padding: "2px 8px", 
                borderRadius: "4px",
                fontFamily: "monospace"
              }}>{bookId}</code>
            </div>
          )}
        </div>
      )}

      {/* Busca por ID para edição */}
      <div style={{ 
        marginBottom: "30px", 
        padding: "20px", 
        backgroundColor: "#e7f1ff", 
        borderRadius: "8px",
        border: "1px solid #b8d4ff"
      }}>
        <h3 style={{ marginBottom: "15px", color: "#0056b3", fontSize: "1.1em" }}>
          🔍 Buscar Livro Existente para Editar
        </h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Digite o ID do livro"
            style={{
              flex: 1,
              padding: "10px 12px",
              border: "1px solid #a6c8ff",
              borderRadius: "4px",
              fontSize: "14px"
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const target = e.target as HTMLInputElement;
                if (target.value.trim()) {
                  fetchBookById(target.value.trim());
                }
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              const input = document.querySelector('input[placeholder*="ID do livro"]') as HTMLInputElement;
              if (input?.value.trim()) {
                fetchBookById(input.value.trim());
              }
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0056b3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Buscar
          </button>
        </div>
        <div style={{ 
          padding: "10px", 
          backgroundColor: "rgba(0,86,179,0.1)", 
          borderRadius: "4px",
          fontSize: "0.85em",
          color: "#0056b3"
        }}>
          <p><strong>💡 Dica:</strong> Use esta busca se você já conhece o ID do livro que deseja editar.</p>
          <p><strong>🔗 URL da API:</strong> {CATALOG_API_URL}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Campo ISBN com busca automática */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#495057" }}>
            ISBN *
            <span style={{ fontSize: "0.8em", color: "#6c757d", marginLeft: "10px", fontWeight: "normal" }}>
              (Digite 10 ou 13 dígitos. Será limpo automaticamente)
            </span>
          </label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleInputChange}
              placeholder="Ex: 978-85-359-0277-5 ou 9788535902775"
              required
              disabled={isEditing}
              style={{
                flex: 1,
                padding: "12px",
                border: `2px solid ${isEditing ? "#e9ecef" : "#ced4da"}`,
                borderRadius: "6px",
                fontSize: "16px",
                backgroundColor: isEditing ? "#f8f9fa" : "white",
                fontFamily: "monospace"
              }}
            />
            {formData.isbn && (
              <div style={{
                padding: "8px 12px",
                backgroundColor: "#f8f9fa",
                border: "1px solid #dee2e6",
                borderRadius: "4px",
                fontSize: "14px",
                fontFamily: "monospace",
                minWidth: "150px",
                textAlign: "center"
              }}>
                {formatIsbnDisplay(formData.isbn)}
              </div>
            )}
          </div>
          {loading && (
            <p style={{ color: "#007bff", marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                width: "16px",
                height: "16px",
                border: "2px solid #f3f3f3",
                borderTop: "2px solid #007bff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }}></span>
              Buscando informações...
            </p>
          )}
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>

        {/* Campos do formulário em grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr", 
          gap: "25px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          border: "1px solid #e9ecef"
        }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#495057" }}>
              Título Original *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              style={{
                padding: "12px",
                width: "100%",
                border: "2px solid #ced4da",
                borderRadius: "6px",
                fontSize: "16px",
                backgroundColor: "white"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#495057" }}>
              Título em Português
            </label>
            <input
              type="text"
              name="title_pt"
              value={formData.title_pt}
              onChange={handleInputChange}
              style={{
                padding: "12px",
                width: "100%",
                border: "2px solid #ced4da",
                borderRadius: "6px",
                backgroundColor: "white"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#495057" }}>
              Autores *
            </label>
            <input
              type="text"
              name="authors"
              value={formData.authors}
              onChange={handleInputChange}
              required
              style={{
                padding: "12px",
                width: "100%",
                border: "2px solid #ced4da",
                borderRadius: "6px",
                fontSize: "16px",
                backgroundColor: "white"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#495057" }}>
              Editora
            </label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleInputChange}
              style={{
                padding: "12px",
                width: "100%",
                border: "2px solid #ced4da",
                borderRadius: "6px",
                backgroundColor: "white"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#495057" }}>
              Data de Publicação
            </label>
            <input
              type="date"
              name="published_date"
              value={formData.published_date}
              onChange={handleInputChange}
              style={{
                padding: "12px",
                width: "100%",
                border: "2px solid #ced4da",
                borderRadius: "6px",
                backgroundColor: "white"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#495057" }}>
              Idioma
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              style={{
                padding: "12px",
                width: "100%",
                border: "2px solid #ced4da",
                borderRadius: "6px",
                backgroundColor: "white"
              }}
            >
              <option value="pt">Português</option>
              <option value="en">Inglês</option>
              <option value="es">Espanhol</option>
              <option value="fr">Francês</option>
              <option value="de">Alemão</option>
              <option value="it">Italiano</option>
            </select>
          </div>

          <div style={{ 
            display: "flex", 
            alignItems: "center",
            gridColumn: "span 2",
            padding: "10px",
            backgroundColor: "#fff3cd",
            borderRadius: "6px",
            border: "1px solid #ffeaa7"
          }}>
            <label style={{ display: "flex", alignItems: "center", fontWeight: "bold", color: "#856404" }}>
              <input
                type="checkbox"
                name="is_admin_overridden"
                checked={formData.is_admin_overridden}
                onChange={handleInputChange}
                style={{ 
                  marginRight: "12px",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                  accentColor: "#856404"
                }}
              />
              Sobrescrito por Admin (permite edição manual de dados)
            </label>
          </div>
        </div>

        {/* URL da Capa */}
        <div style={{ 
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          border: "1px solid #e9ecef"
        }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#495057" }}>
            URL da Capa
          </label>
          <input
            type="url"
            name="cover_url"
            value={formData.cover_url}
            onChange={handleInputChange}
            style={{
              padding: "12px",
              width: "100%",
              border: "2px solid #ced4da",
              borderRadius: "6px",
              marginBottom: "15px",
              backgroundColor: "white"
            }}
          />
          {formData.cover_url && (
            <div style={{ marginTop: "15px" }}>
              <p style={{ marginBottom: "8px", fontWeight: "bold", color: "#495057" }}>Pré-visualização da Capa:</p>
              <img 
                src={formData.cover_url} 
                alt="Capa do livro" 
                style={{ 
                  maxWidth: "200px", 
                  maxHeight: "300px", 
                  border: "2px solid #dee2e6",
                  borderRadius: "6px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    parent.innerHTML += '<p style="color: #dc3545; margin-top: 10px;">❌ Imagem não carregada. URL inválida.</p>';
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Descrição */}
        <div style={{ 
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          border: "1px solid #e9ecef"
        }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#495057" }}>
            Descrição
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={6}
            style={{
              padding: "12px",
              width: "100%",
              border: "2px solid #ced4da",
              borderRadius: "6px",
              resize: "vertical",
              fontFamily: "inherit",
              fontSize: "14px",
              backgroundColor: "white"
            }}
          />
        </div>

        {/* Botões de ação */}
        <div style={{ 
          display: "flex", 
          gap: "15px", 
          marginTop: "30px",
          paddingTop: "20px",
          borderTop: "2px solid #e9ecef"
        }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px 28px",
              backgroundColor: isEditing ? "#28a745" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              flex: 1,
              opacity: loading ? 0.7 : 1,
              transition: "all 0.2s",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.opacity = "0.9";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
              }
            }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <span style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }}></span>
                Processando...
              </span>
            ) : isEditing ? (
              "💾 Atualizar Livro"
            ) : (
              "📚 Cadastrar Livro"
            )}
          </button>
          
          <button
            type="button"
            onClick={resetForm}
            style={{
              padding: "14px 28px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "all 0.2s",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#5a6268";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#6c757d";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
            }}
          >
            🗑️ Limpar Tudo
          </button>
        </div>
      </form>

      {/* Informações de debug */}
      <div style={{ 
        marginTop: "40px", 
        padding: "20px", 
        backgroundColor: "#343a40", 
        borderRadius: "8px", 
        border: "1px solid #495057",
        color: "white"
      }}>
        <h3 style={{ 
          marginBottom: "15px", 
          color: "#adb5bd", 
          borderBottom: "1px solid #495057", 
          paddingBottom: "10px",
          fontSize: "1em"
        }}>
          🔧 Informações de Debug
        </h3>
        <div style={{ 
          backgroundColor: "#495057", 
          padding: "15px", 
          borderRadius: "6px",
          fontSize: "12px",
          fontFamily: "'Courier New', monospace",
          overflowX: "auto"
        }}>
          <div><strong style={{color: "#80bdff"}}>ISBN Limpo:</strong> {cleanIsbn(formData.isbn) || "(vazio)"}</div>
          <div><strong style={{color: "#80bdff"}}>Modo:</strong> {isEditing ? "🎯 Edição" : "✨ Cadastro Novo"}</div>
          <div><strong style={{color: "#80bdff"}}>ID do Livro:</strong> {bookId || "(não definido)"}</div>
          <div><strong style={{color: "#80bdff"}}>URL da API:</strong> {CATALOG_API_URL}</div>
          <div><strong style={{color: "#80bdff"}}>Backend:</strong> Spring Boot (Java)</div>
          <div><strong style={{color: "#80bdff"}}>Status:</strong> {loading ? "⏳ Buscando..." : "✅ Pronto"}</div>
        </div>
      </div>
    </div>
  );
}