import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, KeyRound, Sparkles } from 'lucide-react';
import './GeminiChatbot.css';

/**
 * Componente GeminiChatbot
 * Asistente virtual de biblioteca potenciado por Google Gemini (gemini-2.5-flash).
 * Cuenta con guardrails de sistema para responder exclusivamente sobre el ecosistema bibliotecario.
 */
const GeminiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hola, soy el Asistente Virtual de la Biblioteca Académica. ¿En qué puedo orientarte hoy sobre cursos, disponibilidad de materiales, reservas de laboratorio o tareas?',
    },
  ]);

  const messagesEndRef = useRef(null);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const geminiModel = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.6-flash';

  // Auto-scroll al final del chat cuando se agregue un mensaje
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // System prompt estricto con contexto y guardrails solicitados
  const SYSTEM_INSTRUCTION = `Eres el Asistente Virtual oficial de la Biblioteca Académica y Laboratorio. Tu objetivo es orientar a los usuarios sobre los recursos de la biblioteca.

Contexto del sistema:
- Inventario de Cursos (/courses): Catálogo de materias formativas (Hardware, Electrónica, Telecomunicaciones, etc.) y disponibilidad en tiempo real de materiales de laboratorio.
- Reservas de Laboratorio (/reservations): Permite a los estudiantes reservar puestos de laboratorio y a los administradores gestionar o cancelar reservas.
- Tareas Operativas (/tasks): Módulo donde administradores asignan actividades y usuarios pueden consultar o marcar como completadas sus asignaciones.
- Sistema de Roles: 'admin' (control total, creación y eliminación de cursos/tareas/reservas) y 'user' o 'estudiante' (consulta de cursos, reserva de puestos, marcado de sus tareas).

RESTRICCIÓN ESTRICTA DE SEGURIDAD (GUARDRAILS):
Debes responder ÚNICAMENTE preguntas relacionadas con la biblioteca, cursos académicos, materiales de laboratorio, reservas, tareas y el funcionamiento de esta plataforma.
Si el usuario pregunta sobre cualquier tema ajeno (política, entretenimiento, matemáticas generales no relacionadas con el sistema, cocina, deportes, noticias, programación externa, etc.), debes responder cordialmente:
"Disculpa, solo estoy capacitado para responder dudas sobre el funcionamiento y los recursos de esta biblioteca."`;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const userPrompt = inputValue.trim();

    if (!userPrompt || loading) return;

    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', text: userPrompt },
        {
          role: 'error',
          text: 'Para activar el asistente, define tu clave en el archivo .env como VITE_GEMINI_API_KEY=tu_clave_aqui',
        },
      ]);
      setInputValue('');
      return;
    }

    // Agregar mensaje del usuario a la interfaz
    const updatedMessages = [...messages, { role: 'user', text: userPrompt }];
    setMessages(updatedMessages);
    setInputValue('');
    setLoading(true);

    try {
      // Estructurar el historial para la API de Gemini
      const conversationContents = updatedMessages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        }));

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
          contents: conversationContents,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || `Error en la API de Gemini (${response.status})`
        );
      }

      const data = await response.json();
      const botReply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Disculpa, no pude procesar la respuesta en este momento.';

      setMessages((prev) => [...prev, { role: 'assistant', text: botReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'error',
          text: `Error de comunicación con Gemini: ${err.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gemini-widget-container">
      {/* Botón flotante para abrir o cerrar */}
      <button
        type="button"
        className="gemini-trigger-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Cerrar asistente virtual' : 'Abrir asistente virtual'}
        title={isOpen ? 'Cerrar asistente' : 'Asistente Virtual de Biblioteca'}
      >
        {isOpen ? <X size={24} /> : <Bot size={26} />}
      </button>

      {/* Ventana de conversación */}
      {isOpen && (
        <aside className="gemini-chat-window" aria-label="Asistente Virtual">
          <header className="gemini-chat-header">
            <div className="gemini-header-info">
              <div className="gemini-avatar">
                <Sparkles size={18} />
              </div>
              <div className="gemini-header-text">
                <h4>Asistente Biblioteca</h4>
                <span className="gemini-status">
                  <span className="status-indicator-dot"></span>
                  <span>En línea • {geminiModel}</span>
                </span>
              </div>
            </div>
            <button
              type="button"
              className="gemini-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar ventana de chat"
            >
              <X size={18} />
            </button>
          </header>

          {/* Aviso si falta la variable de entorno */}
          {!apiKey && (
            <div className="gemini-apikey-banner">
              <KeyRound size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <span>Para activar el asistente, define tu clave en el archivo <code>.env</code> como:</span>
                <br />
                <code>VITE_GEMINI_API_KEY=tu_clave_aqui</code>
              </div>
            </div>
          )}

          {/* Área de mensajes con scroll */}
          <div className="gemini-messages-area">
            {messages.map((msg, index) => {
              if (msg.role === 'error') {
                return (
                  <div key={index} className="message-bubble error-bubble">
                    {msg.text}
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  className={`message-bubble ${msg.role === 'user' ? 'user' : 'assistant'}`}
                >
                  {msg.text}
                </div>
              );
            })}

            {loading && (
              <div className="typing-indicator" aria-label="Escribiendo respuesta...">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Barra inferior para enviar preguntas */}
          <form onSubmit={handleSendMessage} className="gemini-input-bar">
            <input
              type="text"
              placeholder="Pregunta sobre cursos, reservas o tareas..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading}
              className="gemini-input-field"
            />
            <button
              type="submit"
              className="gemini-send-btn"
              disabled={loading || !inputValue.trim()}
              aria-label="Enviar mensaje"
            >
              <Send size={16} />
            </button>
          </form>
        </aside>
      )}
    </div>
  );
};

export default GeminiChatbot;
