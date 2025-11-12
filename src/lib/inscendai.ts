// Inscend Unified API Client
// Type-safe client for interacting with all Inscend services

// ============================================================================
// Types & Interfaces
// ============================================================================

type BusinessType = 'U1' | 'U2';

interface ChatRequest {
    message: string;
    session_id?: string | null;
    include_history?: boolean;
}

interface ProductRecommendationRequest {
    new_product: Record<string, any>;
    target_customers?: string[] | null;
    analysis_depth?: string;
}

interface RetentionCheckRequest {
    business_type: string;
    time_context: Record<string, any>;
    target_customers?: string[] | null;
    analysis_depth?: string;
}

interface ApiError {
    detail: Array<{
        loc: (string | number)[];
        msg: string;
        type: string;
    }>;
}

interface ApiClientConfig {
    baseUrl: string;
    bearerToken?: string;
    timeout?: number;
}

// ============================================================================
// API Client Class
// ============================================================================

class InscendApiClient {
    private baseUrl: string;
    private bearerToken?: string;
    private timeout: number;

    constructor(config: ApiClientConfig) {
        this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
        this.bearerToken = config.bearerToken;
        this.timeout = config.timeout || 30000;
    }

    // --------------------------------------------------------------------------
    // Private Helper Methods
    // --------------------------------------------------------------------------

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const headers: any = {
            ...options.headers,
        };

        // Add bearer token if available and not already set
        if (this.bearerToken && !headers['Authorization']) {
            headers['Authorization'] = `Bearer ${this.bearerToken}`;
        }

        // Add content-type for JSON requests if body is present and not FormData
        if (options.body && !(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                headers,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const error: ApiError = await response.json().catch(() => ({
                    detail: [{ loc: [], msg: response.statusText, type: 'error' }],
                }));
                throw new Error(
                    error.detail?.[0]?.msg || `HTTP ${response.status}: ${response.statusText}`
                );
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new Error('Request timeout');
                }
                throw error;
            }
            throw new Error('Unknown error occurred');
        }
    }

    // --------------------------------------------------------------------------
    // Root & Health Endpoints
    // --------------------------------------------------------------------------

    async getRoot(): Promise<any> {
        return this.request('/');
    }

    async healthCheck(): Promise<any> {
        return this.request('/health');
    }

    // --------------------------------------------------------------------------
    // Retention AI Endpoints
    // --------------------------------------------------------------------------

    retention = {
        root: async (): Promise<any> => {
            return this.request('/retention/');
        },

        health: async (): Promise<any> => {
            return this.request('/retention/health');
        },

        recommendForProduct: async (
            request: ProductRecommendationRequest
        ): Promise<any> => {
            return this.request('/retention/recommend/product', {
                method: 'POST',
                body: JSON.stringify(request),
            });
        },

        recommendForRetention: async (
            request: RetentionCheckRequest
        ): Promise<any> => {
            return this.request('/retention/recommend/retention', {
                method: 'POST',
                body: JSON.stringify(request),
            });
        },

        getCustomerInsights: async (
            customerName: string,
            businessType: BusinessType
        ): Promise<any> => {
            const encodedName = encodeURIComponent(customerName);
            return this.request(
                `/retention/customer/${encodedName}/insights?business_type=${businessType}`
            );
        },

        getBusinessPatterns: async (businessType: BusinessType): Promise<any> => {
            return this.request(`/retention/patterns/${businessType}`);
        },

        getSystemStatus: async (): Promise<any> => {
            return this.request('/retention/system/status');
        },
    };

    // --------------------------------------------------------------------------
    // Chat Service Endpoints
    // --------------------------------------------------------------------------

    chat = {
        root: async (): Promise<any> => {
            return this.request('/chat/');
        },

        health: async (): Promise<any> => {
            return this.request('/chat/health');
        },

        send: async (request: ChatRequest): Promise<any> => {
            return this.request('/chat/chat', {
                method: 'POST',
                body: JSON.stringify(request),
            });
        },
    };

    // --------------------------------------------------------------------------
    // CSV/XLSX Table Endpoints
    // --------------------------------------------------------------------------

    csv = {
        root: async (): Promise<any> => {
            return this.request('/csv/');
        },

        health: async (): Promise<any> => {
            return this.request('/csv/health');
        },

        extractTable: async (file: File): Promise<Record<string, any>> => {
            const formData = new FormData();
            formData.append('file', file);

            return this.request('/csv/extract', {
                method: 'POST',
                body: formData,
            });
        },
    };

    // --------------------------------------------------------------------------
    // Image Table Endpoints
    // --------------------------------------------------------------------------

    image = {
        root: async (): Promise<any> => {
            return this.request('/image/');
        },

        health: async (): Promise<any> => {
            return this.request('/image/health');
        },

        extractTable: async (file: File): Promise<Record<string, any>> => {
            const formData = new FormData();
            formData.append('file', file);

            return this.request('/image/extract', {
                method: 'POST',
                body: formData,
            });
        },

        extractPdfTables: async (file: File): Promise<Record<string, any>> => {
            const formData = new FormData();
            formData.append('file', file);

            return this.request('/image/extract-pdf', {
                method: 'POST',
                body: formData,
            });
        },
    };

    // --------------------------------------------------------------------------
    // Utility Methods
    // --------------------------------------------------------------------------

    setBearerToken(token: string): void {
        this.bearerToken = token;
    }

    clearBearerToken(): void {
        this.bearerToken = undefined;
    }
}

// ============================================================================
// Usage Examples
// ============================================================================

// Example 1: Initialize client
export const inscendAIClient = new InscendApiClient({
    baseUrl: 'https://api.inscend.com',
    bearerToken: 'your-token-here',
    timeout: 30000,
});

// Example 2: Health checks
export async function checkHealth() {
    try {
        const health = await inscendAIClient.healthCheck();
        const retentionHealth = await inscendAIClient.retention.health();
        const chatHealth = await inscendAIClient.chat.health();
        console.log('All services healthy:', { health, retentionHealth, chatHealth });
    } catch (error) {
        console.error('Health check failed:', error);
    }
}

// Example 3: Product recommendations (U2 Business)
export async function getProductRecommendations() {
    try {
        const recommendations = await inscendAIClient.retention.recommendForProduct({
            new_product: {
                name: 'Premium Widget',
                category: 'Electronics',
                price: 299.99,
            },
            target_customers: ['customer1', 'customer2'],
            analysis_depth: 'full',
        });
        console.log('Recommendations:', recommendations);
    } catch (error) {
        console.error('Failed to get recommendations:', error);
    }
}

// Example 4: Retention analysis (U1 Business)
export async function analyzeRetention() {
    try {
        const analysis = await inscendAIClient.retention.recommendForRetention({
            business_type: 'U1',
            time_context: {
                current_date: new Date().toISOString(),
                analysis_period: '30_days',
            },
            analysis_depth: 'full',
        });
        console.log('Retention analysis:', analysis);
    } catch (error) {
        console.error('Retention analysis failed:', error);
    }
}

// Example 5: Customer insights
export async function getInsights(customerName: string) {
    try {
        const insights = await inscendAIClient.retention.getCustomerInsights(
            customerName,
            'U1'
        );
        console.log('Customer insights:', insights);
    } catch (error) {
        console.error('Failed to get insights:', error);
    }
}

// Example 6: Chat interaction
export async function chatWithAI(message: string, sessionId?: string) {
    try {
        const response = await inscendAIClient.chat.send({
            message,
            session_id: sessionId,
            include_history: true,
        });
        console.log('Chat response:', response);
        return response;
    } catch (error) {
        console.error('Chat failed:', error);
    }
}

// Example 7: Extract table from CSV
export async function extractFromCsv(file: File) {
    try {
        const data = await inscendAIClient.csv.extractTable(file);
        console.log('Extracted CSV data:', data);
        return data;
    } catch (error) {
        console.error('CSV extraction failed:', error);
    }
}

// Example 8: Extract table from image
export async function extractFromImage(file: File) {
    try {
        const data = await inscendAIClient.image.extractTable(file);
        console.log('Extracted image data:', data);
        return data;
    } catch (error) {
        console.error('Image extraction failed:', error);
    }
}

// Example 9: Extract tables from PDF
export async function extractFromPdf(file: File) {
    try {
        const data = await inscendAIClient.image.extractPdfTables(file);
        console.log('Extracted PDF data:', data);
        return data;
    } catch (error) {
        console.error('PDF extraction failed:', error);
    }
}

// Example 10: Business patterns
export async function getPatterns(businessType: BusinessType) {
    try {
        const patterns = await inscendAIClient.retention.getBusinessPatterns(businessType);
        console.log('Business patterns:', patterns);
        return patterns;
    } catch (error) {
        console.error('Failed to get patterns:', error);
    }
}

// Export for use in other modules
export default InscendApiClient;
export type {
    BusinessType,
    ChatRequest,
    ProductRecommendationRequest,
    RetentionCheckRequest,
    ApiClientConfig,
};