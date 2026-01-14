import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { model } from '../../lib/gemini';

export const ConnectionTester: React.FC = () => {
    const [supaStatus, setSupaStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [aiStatus, setAiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [msg, setMsg] = useState('');

    const testSupabase = async () => {
        setSupaStatus('loading');
        try {
            // Simple query to check connection. Even if table is empty, it shouldn't throw error if authenticated.
            // Using count to be lightweight.
            const { count, error } = await supabase.from('house_areas').select('*', { count: 'exact', head: true });

            if (error) throw error;
            setSupaStatus('success');
            setMsg(prev => prev + `\nSupabase: Connected! Found ${count} areas.`);
        } catch (e: any) {
            setSupaStatus('error');
            console.error(e);
            setMsg(prev => prev + `\nSupabase Error: ${e.message}`);
        }
    };

    const testGemini = async () => {
        setAiStatus('loading');
        try {
            const prompt = "Say 'Hello User' in Spanish.";
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            setAiStatus('success');
            setMsg(prev => prev + `\nGemini: ${text}`);
        } catch (e: any) {
            setAiStatus('error');
            console.error(e);
            setMsg(prev => prev + `\nGemini Error: ${e.message}`);
        }
    };

    return (
        <div className="p-4 m-4 bg-gray-100 rounded-lg border border-gray-200">
            <h3 className="font-bold mb-2">Integration Tests</h3>
            <div className="flex gap-2 mb-4">
                <button
                    onClick={testSupabase}
                    className={`px-3 py-1 rounded text-white text-sm ${supaStatus === 'loading' ? 'bg-gray-400' : supaStatus === 'success' ? 'bg-status-ok' : supaStatus === 'error' ? 'bg-alert' : 'bg-action'}`}
                >
                    Test Supabase
                </button>
                <button
                    onClick={testGemini}
                    className={`px-3 py-1 rounded text-white text-sm ${aiStatus === 'loading' ? 'bg-gray-400' : aiStatus === 'success' ? 'bg-status-ok' : aiStatus === 'error' ? 'bg-alert' : 'bg-action'}`}
                >
                    Test Gemini
                </button>
            </div>
            <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32 whitespace-pre-wrap">
                {msg || 'Ready to test...'}
            </pre>
        </div>
    );
};
