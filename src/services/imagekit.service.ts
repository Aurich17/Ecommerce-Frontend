// src/app/services/imagekit.service.ts
import { Injectable } from '@angular/core';
import ImageKit from 'imagekit-javascript';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ImagekitClient {
  private ik = new ImageKit({
    publicKey: environment.imagekitPublicKey,
    urlEndpoint: environment.imagekitUrlEndpoint,
    authenticationEndpoint: `${environment.urlApi}/imagekit/auth`, // Nest
  });

  constructor(private http: HttpClient) {}

  async uploadAndSave(file: File, folder = '/uploads', tags: string[] = []) {
    const res: any = await this.ik.upload({
      file, fileName: file.name, folder, tags, useUniqueFileName: true,
    });

    // 👇 Llamada a tu API Nest (ajusta URL si no usas proxy o prefix)
    await this.http.post(
      `${environment.urlApi}/imagekit/upload`,
      {
        fileId: res.fileId,
        url: res.url,
        thumbnailUrl: res.thumbnailUrl,
        width: res.width,
        height: res.height,
        size: res.size,
        format: res.fileType ?? res.mime,
        tags: res.tags,
      }
    ).toPromise();

    return res; // devuelves lo de ImageKit
  }

  url(pathOrSrc: { path?: string; src?: string }, opts?: { w?: number; h?: number; q?: number; f?: 'auto'|'webp'|'jpg'|'png' }) {
    const transformation:any[] = [];
    if (opts?.w) transformation.push({ width: opts.w });
    if (opts?.h) transformation.push({ height: opts.h });
    if (opts?.q) transformation.push({ quality: opts.q });
    if (opts?.f) transformation.push({ format: opts.f });
    if (pathOrSrc.path) return this.ik.url({ path: pathOrSrc.path, transformation });
    if (pathOrSrc.src)  return this.ik.url({ src:  pathOrSrc.src,  transformation });
    throw new Error('Either path or src must be provided');
  }
}
