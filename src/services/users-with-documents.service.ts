import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

// Interfaces para la respuesta de usuarios con documentos
export interface UserDocument {
  id: number;
  fileName: string;
  imageUrl: string;
  documentType: string;
  createdAt: string;
}

export interface UserRole {
  id: number;
  name: string;
  description: string;
}

export interface UserWithDocuments {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  socialSecurity: string;
  status: string;
  createdAt: string;
  primaryRole: string;
  roles: UserRole[];
  documents: UserDocument[];
}

export interface UsersWithDocumentsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UsersWithDocumentsResponse {
  data: UserWithDocuments[];
  pagination: UsersWithDocumentsPagination;
}

// Interface para filtros de búsqueda
export interface UsersWithDocumentsFilters {
  page?: number;
  limit?: number;
  q?: string;
  estCod?: string;
  roleId?: number;
}

// Interface para actualizar estado de usuario
export interface UpdateUserStatusRequest {
  status: string;
}

export interface UpdateUserStatusResponse {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  socialSecurity: string;
  status: string;
  roles: UserRole[];
  accountState: {
    tab: string;
    cod: string;
    desc: string;
  };
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersWithDocumentsService {
  private apiUrl = environment.urlApi;

  constructor(private http: HttpClient) {}

  // GET /users/with-documents - Lista usuarios con sus documentos y roles asociados
  getUsersWithDocuments(
    filters?: UsersWithDocumentsFilters
  ): Observable<UsersWithDocumentsResponse> {
    let params = new HttpParams();

    if (filters?.page) {
      params = params.set('page', filters.page.toString());
    }
    if (filters?.limit) {
      params = params.set('limit', filters.limit.toString());
    }
    if (filters?.q) {
      params = params.set('q', filters.q);
    }
    if (filters?.estCod) {
      params = params.set('estCod', filters.estCod);
    }
    if (filters?.roleId) {
      params = params.set('roleId', filters.roleId.toString());
    }

    return this.http.get<UsersWithDocumentsResponse>(
      `${this.apiUrl}/users/with-documents`,
      { params }
    );
  }

  // PATCH /users/:id/status - Actualiza únicamente el estado de un usuario
  updateUserStatus(
    userId: string, // 👈 string (UUID)
    statusData: { status: string }
  ) {
    return this.http.patch<{ success: boolean; data: any }>(
      `${this.apiUrl}/users/${userId}/status`, // usa el mismo prefijo que el resto (p.ej. /api)
      statusData
    );
  }

  getUserDocuments(userId: string, type: 'cliente' | 'empresa') {
    return this.http.get<{ success: boolean; data: UserDocument[] }>(
      `/api/users/${userId}/documents`,
      { params: { type } }
    );
  }
}
