const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function callEdgeFunction(functionName, data) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Edge function error: ${error}`);
  }

  return response.json();
}

export const InvokeLLM = async (params) => {
  return callEdgeFunction('invoke-llm', params);
};

export const SendEmail = async (params) => {
  return callEdgeFunction('send-email', params);
};

export const UploadFile = async (params) => {
  throw new Error('UploadFile not yet implemented. Use Supabase Storage directly.');
};

export const GenerateImage = async (params) => {
  return callEdgeFunction('generate-image', params);
};

export const ExtractDataFromUploadedFile = async (params) => {
  throw new Error('ExtractDataFromUploadedFile not yet implemented.');
};

export const CreateFileSignedUrl = async (params) => {
  throw new Error('CreateFileSignedUrl not yet implemented. Use Supabase Storage directly.');
};

export const UploadPrivateFile = async (params) => {
  throw new Error('UploadPrivateFile not yet implemented. Use Supabase Storage directly.');
};

export const Core = {
  InvokeLLM,
  SendEmail,
  UploadFile,
  GenerateImage,
  ExtractDataFromUploadedFile,
  CreateFileSignedUrl,
  UploadPrivateFile
};
