import { Injectable } from '@angular/core';
import ImageKit from 'imagekit-javascript';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ImagekitClient {
  private ik = new ImageKit({
    publicKey: environment.imagekitPublicKey,              // o desde environment
    urlEndpoint: environment.imagekitUrlEndpoint,           // idem
    authenticationEndpoint: '/api/imagekit/auth', // proxy del backend Nest
  });

  constructor(private http: HttpClient) {}

  async uploadBrowser(file: File, folder = '/uploads', tags: string[] = []) {
    return this.ik.upload({
      file,
      fileName: file.name,
      folder,
      tags,
      useUniqueFileName: true,
    });
  }

  // Generar URL transformada (resize/format al vuelo)
  url(pathOrSrc: { path?: string; src?: string }, opts?: { w?: number; h?: number; q?: number; f?: 'auto'|'webp'|'jpg'|'png' }) {
    const transformation: any[] = [];
    if (opts?.w) transformation.push({ width: opts.w });
    if (opts?.h) transformation.push({ height: opts.h });
    if (opts?.q) transformation.push({ quality: opts.q });
    if (opts?.f) transformation.push({ format: opts.f });

    // Ensure either 'path' or 'src' is a defined string
    if (pathOrSrc.path) {
      return this.ik.url({
        path: pathOrSrc.path,
        transformation,
      });
    } else if (pathOrSrc.src) {
      return this.ik.url({
        src: pathOrSrc.src,
        transformation,
      });
    } else {
      throw new Error('Either path or src must be provided');
    }
  }
}
